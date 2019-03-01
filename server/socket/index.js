
const socketIo = require('socket.io');
const uuid = require('uuid/v1');
const request = require('request-promise');
const socketModel = require('../models/socket');
const { savePrivateMsg } = require('../models/privateChat');
const groupChatModel = require('../models/groupChat');
const msgModel = require('../models/message');
const userInfoModel = require('../models/userInfo');
const groupInfoModel = require('../models/groupInfo');
const { getAllMessage, getGroupMsg } = require('./message');
const verify = require('../middlewares/verify');
const getUploadToken = require('../utils/qiniu');

module.exports = (server) => {
  const io = socketIo(server);
  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (verify(token)) {
      return next();
    }
    return next(new Error('Authentication error'));
  });
  io.on('connection', (socket) => {
    const socketId = socket.id;
    let _userId;
    socket.on('login', async (userId) => {
      _userId = userId;
      await socketModel.saveUserSocketId(userId, socketId);
      await userInfoModel.updateUserStatus(userId, 1);
    });

    // 初始化群聊
    socket.on('initGroupChat', async (data) => {
      const result = await msgModel.getGroupList(data.userId);
      const groupList = JSON.parse(JSON.stringify(result));
      for (const item of groupList) {
        socket.join(item.to_group_id);
      }
    });

    // 初始化， 获取群聊和私聊的数据
    socket.on('initMessage', async (userId, fn) => {
      const data = await getAllMessage({ userId });
      fn(data);
    });

    // 私聊发信息
    socket.on('sendPrivateMsg', async (data) => {
      if (!data) return;
      data.attachments = JSON.stringify(data.attachments);
      await savePrivateMsg({ ...data });
      const arr = await socketModel.getUserSocketId(data.to_user);
      const RowDataPacket = arr[0];
      const socketId = JSON.parse(JSON.stringify(RowDataPacket)).socketid;
      io.to(socketId).emit('getPrivateMsg', data);
    });

    // 群聊发信息
    socket.on('sendGroupMsg', async (data) => {
      if (!data) return;
      data.attachments = JSON.stringify(data.attachments);
      await groupChatModel.saveGroupMsg({ ...data });
      socket.broadcast.to(data.to_group_id).emit('getGroupMsg', data);
    });

    // 获取群聊信息
    socket.on('getOneGroupMsg', async (data, fn) => {
      const groupMsgAndInfo = await getGroupMsg({ groupId: data.groupId });
      fn(groupMsgAndInfo);
    });

    // 建群
    socket.on('createGroup', async (data, fn) => {
      const to_group_id = uuid();
      const {
        name, group_notice, creator, create_time
      } = data;
      const avatar = data.avatar || null;
      const arr = [to_group_id, name, group_notice, creator, create_time, avatar];
      await groupInfoModel.createGroup(arr);
      await groupInfoModel.joinGroup(data.creator_id, to_group_id);
      fn({ to_group_id, ...data });
    });

    // 加群
    socket.on('joinGroup', async (data, fn) => {
      const { userInfo, toGroupId } = data;
      await groupInfoModel.joinGroup(userInfo.userId, toGroupId);
      socket.join(toGroupId);
      const groupMessages = await getGroupMsg({ groupId: toGroupId });
      fn(groupMessages);
      socket.broadcast.to(toGroupId).emit('getGroupMsg', userInfo);
    });

    // 退群
    socket.on('leaveGroup', async (data) => {
      const { userId, toGroupId } = data;
      socket.leave(toGroupId);
      await groupInfoModel.leaveGroup(userId, toGroupId);
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


    // 机器人聊天
    socket.on('robotChat', async (data, fn) => {
      const date = {
        key: '92febb91673740c2814911a6c16dbcc5',
        info: data.message,
        userid: data.userId
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


    socket.on('disconnect', async () => {
      await userInfoModel.updateUserStatus(_userId, 0);
      console.log('disconnect', _userId);
    });
  });
};
