/* eslint-disable consistent-return */
import * as request from 'request-promise';
import * as socketIo from 'socket.io';
import * as uuid from 'uuid/v1';

import configs from '@configs';
import { ServicesContext } from '../context';
import { authVerify } from '../middlewares/verify';
import { getUploadToken } from '../utils/qiniu';
import { getAllMessage, getGroupItem } from './message.socket';
import { requestFrequency } from '../middlewares/requestFrequency';

function getSocketIdHandle(arr) {
  return arr[0] ? JSON.parse(JSON.stringify(arr[0])).socketid : '';
}

function emitAsync(socket, emitName, data, callback) {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.emit) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('pls input socket');
    }
    socket.emit(emitName, data, (...args) => {
      let response;
      if (typeof callback === 'function') {
        response = callback(...args);
      }
      resolve(response);
    });
  });
}

export const appSocket = server => {
  const {
    userService,
    chatService,
    groupChatService,
    groupService,
  } = ServicesContext.getInstance();

  const io = socketIo(server);

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (authVerify(token)) {
      console.log('veryfy socket token success', token);
      return next();
    }
    return next(new Error(`Authentication error! time =>${new Date().toLocaleString()}`));
  });

  io.on('connection', async socket => {
    const socketId = socket.id;
    let user_id;
    let clientHomePageList;
    console.log('connection socketId=>', socketId, 'time=>', new Date().toLocaleString());

    // 获取群聊和私聊的数据
    await emitAsync(socket, 'initSocket', socketId, (userId, homePageList) => {
      console.log('userId', userId);
      user_id = userId;
      clientHomePageList = homePageList;
    });
    const allMessage = await getAllMessage({ user_id, clientHomePageList });
    socket.emit('initSocketSuccess', allMessage);
    console.log('initSocketSuccess user_id=>', user_id, 'time=>', new Date().toLocaleString());

    socket.use((packet, next) => {
      if (!requestFrequency(socketId)) return next();
      next(new Error('Access interface frequently, please try again in a minute!'));
    });

    // init socket
    const arr = await userService.getUserSocketId(user_id);
    const existSocketIdStr = getSocketIdHandle(arr);
    const newSocketIdStr = existSocketIdStr ? `${existSocketIdStr},${socketId}` : socketId;
    await userService.saveUserSocketId(user_id, newSocketIdStr);
    console.log('initSocket user_id=>', user_id, 'time=>', new Date().toLocaleString());

    // init GroupChat
    const result = await userService.getGroupList(user_id);
    const groupList = JSON.parse(JSON.stringify(result));
    for (const item of groupList) {
      socket.join(item.to_group_id);
    }
    console.log('initGroupChat user_id=>', user_id, 'time=>', new Date().toLocaleString());

    // 私聊发信息
    socket.on('sendPrivateMsg', async (data, cbFn) => {
      try {
        if (!data) return;
        data.time = Date.parse(new Date().toString()) / 1000;
        await Promise.all([
          chatService.savePrivateMsg({
            ...data,
            attachments: JSON.stringify(data.attachments),
          }),
          userService.getUserSocketId(data.to_user).then(arr => {
            const existSocketIdStr = getSocketIdHandle(arr);
            const toUserSocketIds = (existSocketIdStr && existSocketIdStr.split(',')) || [];

            toUserSocketIds.forEach(e => {
              io.to(e).emit('getPrivateMsg', data);
            });
          }),
        ]);
        console.log('sendPrivateMsg data=>', data, 'time=>', new Date().toLocaleString());
        cbFn(data);
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    // 群聊发信息
    socket.on('sendGroupMsg', async (data, cbFn) => {
      try {
        if (!data) return;
        data.attachments = JSON.stringify(data.attachments);
        data.time = Date.parse(new Date().toString()) / 1000;
        await groupChatService.saveGroupMsg({ ...data });
        socket.broadcast.to(data.to_group_id).emit('getGroupMsg', data);
        console.log('sendGroupMsg data=>', data, 'time=>', new Date().toLocaleString());
        cbFn(data);
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    socket.on('getOnePrivateChatMessages', async (data, fn) => {
      try {
        const { user_id, toUser, start, count } = data;
        const RowDataPacket = await chatService.getPrivateDetail(user_id, toUser, start - 1, count);
        const privateMessages = JSON.parse(JSON.stringify(RowDataPacket));
        console.log(
          'getOnePrivateChatMessages data=>',
          data,
          'time=>',
          new Date().toLocaleString(),
        );
        fn(privateMessages);
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    // get group messages in a group;
    socket.on('getOneGroupMessages', async (data, fn) => {
      try {
        const RowDataPacket = await groupChatService.getGroupMsg(
          data.groupId,
          data.start - 1,
          data.count,
        );
        const groupMessages = JSON.parse(JSON.stringify(RowDataPacket));
        console.log('getOneGroupMessages data=>', data, 'time=>', new Date().toLocaleString());
        fn(groupMessages);
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    // get group item including messages and group info.
    socket.on('getOneGroupItem', async (data, fn) => {
      try {
        const groupMsgAndInfo = await getGroupItem({
          groupId: data.groupId,
          start: data.start || 1,
          count: 20,
        });
        console.log('getOneGroupItem data=>', data, 'time=>', new Date().toLocaleString());
        fn(groupMsgAndInfo);
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    // 建群
    socket.on('createGroup', async (data, fn) => {
      try {
        const to_group_id = uuid();
        data.create_time = Date.parse(new Date().toString()) / 1000;
        const { name, group_notice, creator_id, create_time } = data;
        const arr = [to_group_id, name, group_notice, creator_id, create_time];
        await groupService.createGroup(arr);
        await groupService.joinGroup(creator_id, to_group_id);
        socket.join(to_group_id);
        console.log('createGroup data=>', data, 'time=>', new Date().toLocaleString());
        fn({ to_group_id, ...data });
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    // 修改群资料
    socket.on('updateGroupInfo', async (data, fn) => {
      try {
        await groupService.updateGroupInfo(data);
        console.log('updateGroupInfo data=>', data, 'time=>', new Date().toLocaleString());
        fn('修改群资料成功');
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    // 加群
    socket.on('joinGroup', async (data, fn) => {
      try {
        const { userInfo, toGroupId } = data;
        const joinedThisGroup = (await groupService.isInGroup(userInfo.user_id, toGroupId)).length;
        if (!joinedThisGroup) {
          await groupService.joinGroup(userInfo.user_id, toGroupId);
          socket.broadcast.to(toGroupId).emit('getGroupMsg', {
            ...userInfo,
            message: `${userInfo.name}加入了群聊`,
            to_group_id: toGroupId,
            tip: 'joinGroup',
          });
        }
        socket.join(toGroupId);
        const groupItem = await getGroupItem({ groupId: toGroupId });
        console.log('joinGroup data=>', data, 'time=>', new Date().toLocaleString());
        fn(groupItem);
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    // 退群
    socket.on('leaveGroup', async data => {
      try {
        const { user_id, toGroupId } = data;
        socket.leave(toGroupId);
        await groupService.leaveGroup(user_id, toGroupId);
        console.log('leaveGroup data=>', data, 'time=>', new Date().toLocaleString());
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    // 获取群成员信息
    socket.on('getGroupMember', async (groupId, fn) => {
      try {
        const RowDataPacket = await groupChatService.getGroupMember(groupId);
        const userInfos = JSON.parse(JSON.stringify(RowDataPacket));
        io.in(groupId).clients((err, onlineSockets) => {
          if (err) {
            throw err;
          }
          userInfos.forEach(userInfo => {
            userInfo.status = 0;
            if (userInfo.socketid) {
              const socketIds = userInfo.socketid.split(',');
              for (const onlineSocket of onlineSockets) {
                const socketExist = socketIds.some(socketId => socketId === onlineSocket);
                if (socketExist) {
                  userInfo.status = 1;
                }
              }
            }
            delete userInfo.socketid;
          });
          console.log('getGroupMember data=>', groupId, 'time=>', new Date().toLocaleString());
          fn(userInfos);
        });
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    //  模糊匹配用户或者群组
    socket.on('fuzzyMatch', async (data, fn) => {
      try {
        let fuzzyMatchResult;
        const field = `%${data.field}%`;
        if (data.searchUser) {
          fuzzyMatchResult = await userService.fuzzyMatchUsers(field);
        } else {
          fuzzyMatchResult = await groupService.fuzzyMatchGroups(field);
        }
        fn({ fuzzyMatchResult, searchUser: data.searchUser });
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    // qiniu token
    socket.on('getQiniuToken', async (data, fn) => {
      try {
        const uploadToken = await getUploadToken();
        console.log('getQiniuToken data=>', data, 'time=>', new Date().toLocaleString());
        return fn(uploadToken);
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    /**
     * 加为联系人
     * @param  user_id  本机用户
     *         from_user  本机用户的朋友（对方）
     */
    socket.on('addAsTheContact', async (data, fn) => {
      try {
        const { user_id, from_user } = data;
        const time = Date.now() / 1000;
        await userService.addFriendEachOther(user_id, from_user, time);
        const userInfo = await userService.getUserInfo(from_user);
        console.log('addAsTheContact data=>', data, 'time=>', new Date().toLocaleString());
        fn(userInfo[0]);
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    socket.on('getUserInfo', async (user_id, fn) => {
      try {
        const userInfo = await userService.getUserInfo(user_id);
        console.log('getUserInfo user_id=>', user_id, 'time=>', new Date().toLocaleString());
        fn(userInfo[0]);
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    // 机器人聊天
    socket.on('robotChat', async (data, fn) => {
      try {
        const date = {
          key: configs.robot_key,
          info: data.message,
          userid: data.user_id,
        };
        const options = {
          method: 'POST',
          uri: 'http://www.tuling123.com/openapi/api',
          body: date,
          json: true, // Automatically stringifies the body to JSON
        };
        const response = configs.robot_key
          ? await request(options)
          : {
              text:
                '请在 http://www.tuling123.com/ 登录并注册个机器人, 取到apikey放到代码configs中',
            };
        console.log('robotChat data=>', data, 'time=>', new Date().toLocaleString());
        fn(response);
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    socket.on('deleteContact', async ({ from_user, to_user }, fn) => {
      try {
        await userService.deleteContact(from_user, to_user);
        const sockets = await userService.getUserSocketId(to_user);
        const existSocketIdStr = getSocketIdHandle(sockets);
        const toUserSocketIds = (existSocketIdStr && existSocketIdStr.split(',')) || [];
        toUserSocketIds.forEach(e => {
          io.to(e).emit('beDeleted', from_user);
        });
        console.log(
          'deleteContact user_id && to_user =>',
          from_user,
          to_user,
          'time=>',
          new Date().toLocaleString(),
        );
        fn({ code: 200, data: 'delete contact successfully' });
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });

    socket.on('disconnect', async reason => {
      try {
        const arr = await userService.getUserSocketId(user_id);
        const existSocketIdStr = getSocketIdHandle(arr);
        const toUserSocketIds = (existSocketIdStr && existSocketIdStr.split(',')) || [];
        const index = toUserSocketIds.indexOf(socketId);

        if (index > -1) {
          toUserSocketIds.splice(index, 1);
        }

        await userService.saveUserSocketId(user_id, toUserSocketIds.join(','));

        // if (toUserSocketIds.length) {
        //   await userService.saveUserSocketId(_userId, toUserSocketIds.join(','));
        // } else {
        //   await Promise.all([
        //     userService.saveUserSocketId(_userId, toUserSocketIds.join(',')),
        //     userService.updateUserStatus(_userId, 0)
        //   ]);
        // }

        console.log(
          'disconnect.=>reason',
          reason,
          'user_id=>',
          user_id,
          'socket.id=>',
          socket.id,
          'time=>',
          new Date().toLocaleString(),
        );
      } catch (error) {
        console.log('error', error.message);
        io.to(socketId).emit('error', { code: 500, message: error.message });
      }
    });
  });
};
