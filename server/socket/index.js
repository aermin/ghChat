
const socketIo = require('socket.io');
const uuid = require('uuid/v1');
const request = require('request-promise');
const socketModel = require('../models/socket');
const privateChatModel = require('../models/privateChat');
const groupChatModel = require('../models/groupChat');
const msgModel = require('../models/message');
const userInfoModel = require('../models/userInfo');
const groupInfoModel = require('../models/groupInfo');
const { getAllMessage, getGroupItem } = require('./message');
const verify = require('../middlewares/verify');
const getUploadToken = require('../utils/qiniu');

module.exports = (server) => {
  const io = socketIo(server);
  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (verify(token)) {
      return next();
    }
    return next(new Error(`Authentication error! time =>${new Date().toLocaleString()}`));
  });
  io.on('connection', (socket) => {
    const socketId = socket.id;
    let _userId;
    try {
      socket.on('initSocket', async (user_id, fn) => {
        _userId = user_id;
        await socketModel.saveUserSocketId(user_id, socketId);
        await userInfoModel.updateUserStatus(user_id, 1);
        fn('initSocket success');
      });

      // 初始化群聊
      socket.on('initGroupChat', async (user_id, fn) => {
        const result = await msgModel.getGroupList(user_id);
        const groupList = JSON.parse(JSON.stringify(result));
        for (const item of groupList) {
          socket.join(item.to_group_id);
        }
        fn('init group chat success');
      });

      // 初始化， 获取群聊和私聊的数据
      socket.on('initMessage', async ({ user_id, clientHomePageList }, fn) => {
        const data = await getAllMessage({ user_id, clientHomePageList });
        fn(data);
      });

      // 私聊发信息
      socket.on('sendPrivateMsg', async (data) => {
        if (!data) return;
        data.attachments = JSON.stringify(data.attachments);
        await privateChatModel.savePrivateMsg({ ...data });
        const arr = await socketModel.getUserSocketId(data.to_user);
        const toUserSocketId = JSON.parse(JSON.stringify(arr[0])).socketid;
        io.to(toUserSocketId).emit('getPrivateMsg', data);
        // logs to debug;
        console.log(`[userId:${_userId}, socketId:${socketId}] send private msg to [userId:${data.to_user}, socketId:${toUserSocketId}]`);
      });

      // 群聊发信息
      socket.on('sendGroupMsg', async (data) => {
        if (!data) return;
        data.attachments = JSON.stringify(data.attachments);
        await groupChatModel.saveGroupMsg({ ...data });
        socket.broadcast.to(data.to_group_id).emit('getGroupMsg', data);
        // logs to debug;
        console.log(`[userId:${_userId}, socketId:${socketId}] send group msg:${data} to to_group_id:${data.to_group_id}`);
      });

      socket.on('getOnePrivateChatMessages', async (data, fn) => {
        const {
          user_id, toUser, start, count
        } = data;
        const RowDataPacket = await privateChatModel.getPrivateDetail(user_id, toUser, start - 1, count);
        const privateMessages = JSON.parse(JSON.stringify(RowDataPacket));
        console.log('getOnePrivateChatMessages: data, privateMessages', data, privateMessages);
        fn(privateMessages);
      });

      // get group messages in a group;
      socket.on('getOneGroupMessages', async (data, fn) => {
        const RowDataPacket = await groupChatModel.getGroupMsg(data.groupId, data.start - 1, data.count);
        const groupMessages = JSON.parse(JSON.stringify(RowDataPacket));
        console.log('getOneGroupMessages: data, groupMessages', data, groupMessages);
        fn(groupMessages);
      });

      // get group item including messages and group info.
      socket.on('getOneGroupItem', async (data, fn) => {
        const groupMsgAndInfo = await getGroupItem({
          groupId: data.groupId,
          startLine: data.start || 1,
          count: 20
        });
        fn(groupMsgAndInfo);
      });

      // 建群
      socket.on('createGroup', async (data, fn) => {
        const to_group_id = uuid();
        const {
          name, group_notice, creator_id, create_time
        } = data;
        const arr = [to_group_id, name, group_notice, creator_id, create_time];
        await groupInfoModel.createGroup(arr);
        await groupInfoModel.joinGroup(creator_id, to_group_id);
        socket.join(to_group_id);
        fn({ to_group_id, ...data });
      });

      // 修改群资料
      socket.on('updateGroupInfo', async (data, fn) => {
        await groupInfoModel.updateGroupInfo(data);
        fn('修改群资料成功');
      });

      // 加群
      socket.on('joinGroup', async (data, fn) => {
        const { userInfo, toGroupId } = data;
        await groupInfoModel.joinGroup(userInfo.user_id, toGroupId);
        socket.join(toGroupId);
        const groupItem = await getGroupItem({ groupId: toGroupId });
        fn(groupItem);
        socket.broadcast.to(toGroupId).emit('getGroupMsg', {
          ...userInfo,
          message: `${userInfo.name}加入了群聊`,
          to_group_id: toGroupId,
          tip: 'joinGroup'
        });
      });

      // 退群
      socket.on('leaveGroup', async (data) => {
        const { user_id, toGroupId } = data;
        socket.leave(toGroupId);
        await groupInfoModel.leaveGroup(user_id, toGroupId);
      });

      // 获取群成员信息
      socket.on('getGroupMember', async (groupId, fn) => {
        const RowDataPacket = await groupChatModel.getGroupMember(groupId);
        const getGroupMember = JSON.parse(JSON.stringify(RowDataPacket));
        fn(getGroupMember);
      });

      //  模糊匹配用户或者群组
      socket.on('fuzzyMatch', async (data, fn) => {
        let fuzzyMatchResult;
        const field = `%${data.field}%`;
        if (data.searchUser) {
          fuzzyMatchResult = await userInfoModel.fuzzyMatchUsers(field);
        } else {
          fuzzyMatchResult = await groupInfoModel.fuzzyMatchGroups(field);
        }
        fn({ fuzzyMatchResult, searchUser: data.searchUser });
      });

      // qiniu token
      socket.on('getQiniuToken', async (fn) => {
        const uploadToken = await getUploadToken();
        return fn(uploadToken);
      });

      /**
     * 加为联系人
     * @param  user_id  本机用户
     *         from_user  本机用户的朋友（对方）
     */
      socket.on('addAsTheContact', async (data, fn) => {
        const { user_id, from_user } = data;
        const time = Date.parse(new Date()) / 1000;
        await userInfoModel.addFriendEachOther(user_id, from_user, time);
        const userInfo = await userInfoModel.getUserInfo(from_user);
        fn(userInfo[0]);
      });

      socket.on('getOneChatInfo', async (groupId, fn) => {
        const groupInfo = await groupChatModel.getGroupInfo([groupId, null]);
        fn(groupInfo[0]);
      });

      socket.on('getOneUserInfo', async (groupId, fn) => {
        const userInfo = await userInfoModel.getUserInfo([groupId, null]);
        fn(userInfo[0]);
      });


      // 机器人聊天
      socket.on('robotChat', async (data, fn) => {
        const date = {
          key: '92febb91673740c2814911a6c16dbcc5',
          info: data.message,
          userid: data.user_id
        };
        const options = {
          method: 'POST',
          uri: 'http://www.tuling123.com/openapi/api',
          body: date,
          json: true // Automatically stringifies the body to JSON
        };
        const response = await request(options);
        fn(response);
      });


      socket.on('disconnect', async (reason) => {
        await userInfoModel.updateUserStatus(_userId, 0);
        console.log('disconnect.=>reason', reason, 'user_id=>', _userId, 'socket.id=>', socket.id, 'time=>', new Date().toLocaleString());
      });
    } catch (error) {
      io.to(socketId).emit('error', error);
    }
  });
};
