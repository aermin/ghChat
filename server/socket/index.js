
const socketIo = require('socket.io');
const uuid = require('uuid/v1');
const socketModel = require('../models/socket');
const { savePrivateMsg } = require('../models/privateChat');
const { saveGroupMsg } = require('../models/groupChat');
const msgModel = require('../models/message');
const userInfoModel = require('../models/userInfo');
const groupInfoModel = require('../models/groupInfo');
const { getAllMessage, getGroupMsg } = require('./message');
const verify = require('../middlewares/verify');
const getUploadToken = require('../utils/qiniu');
// const login = require('./login');

// module.exports = server => (ctx) => {
module.exports = (server) => {
  // console.log('ctx233', ctx);
  const io = socketIo(server);
  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (verify(token)) {
      return next();
    }
    return next(new Error('Authentication error'));
  });
  io.on('connection', (socket) => {
    // console.log('socket2333', socket);
    const socketId = socket.id;
    socket.on('saveSocketIdByUserId', async (userId) => {
      await socketModel.saveUserSocketId(userId, socketId);
    });

    // 初始化群聊
    socket.on('initGroupChat', async (data) => {
      console.log('initGroupChat', data);
      const result = await msgModel.getGroupList(data.userId);
      const groupList = JSON.parse(JSON.stringify(result));
      for (const item of groupList) {
        socket.join(item.to_group_id);
      }
    });

    // 初始化， 获取群聊和私聊的数据
    socket.on('initMessage', async (userId) => {
      console.log('userId233', userId);
      const data = await getAllMessage({ userId });
      // console.log('getAllMessage', data);
      io.to(socketId).emit('getAllMessage', data);
    });

    // 私聊发信息
    socket.on('sendPrivateMsg', async (data) => {
      if (!data) return;
      data.attachments = JSON.stringify(data.attachments);
      await savePrivateMsg({ ...data });
      const arr = await socketModel.getUserSocketId(data.to_user);
      const RowDataPacket = arr[0];
      const socketId = JSON.parse(JSON.stringify(RowDataPacket)).socketid;
      console.log('socketId2333', socketId);
      io.to(socketId).emit('getPrivateMsg', data);
    });

    // 群聊发信息
    socket.on('sendGroupMsg', async (data) => {
      if (!data) return;
      data.attachments = JSON.stringify(data.attachments);
      await saveGroupMsg({ ...data });
      console.log('sendGroupMsg', data);
      socket.broadcast.to(data.to_group_id).emit('getGroupMsg', data);
    });

    // 获取群聊信息
    socket.on('getGroupMsg', async (data) => {
      const groupMsgAndInfo = await getGroupMsg({ groupId: data.groupId });
      io.to(socketId).emit('getGroupMsgRes', groupMsgAndInfo);
    });

    // 建群
    socket.on('createGroup', async (data) => {
      const to_group_id = uuid();
      const {
        name, group_notice, creator, create_time
      } = data;
      const avatar = 'https://user-images.githubusercontent.com/24861316/47977783-fdd46f80-e0f4-11e8-93ec-8b0a1268c1e3.jpeg';
      const arr = [to_group_id, name, group_notice, avatar, creator, create_time];
      await groupInfoModel.createGroup(arr);
      await groupInfoModel.joinGroup(data.creator_id, to_group_id);
      io.to(socketId).emit('createGroupRes', { to_group_id, avatar, ...data });
    });

    // 加群
    socket.on('joinGroup', async (data) => {
      const { userId, toGroupId } = data;
      await groupInfoModel.joinGroup(userId, toGroupId);
      socket.join(toGroupId);
      const groupMessages = await getGroupMsg({ groupId: toGroupId });
      console.log('groupMessages2333', groupMessages);
      io.to(socketId).emit('joinGroupRes', groupMessages);
    });

    // 退群
    socket.on('leaveGroup', async (data) => {
      const { userId, toGroupId } = data;
      socket.leave(toGroupId);
      console.log('userId, toGroupId', userId, toGroupId);
      await groupInfoModel.leaveGroup(userId, toGroupId);
    });

    //  模糊匹配用户或者群组
    socket.on('fuzzyMatch', async (data) => {
      let fuzzyMatchResult;
      const field = `%${data.field}%`;
      if (data.searchUser) {
        fuzzyMatchResult = await userInfoModel.fuzzyMatchUsers(field);
      } else {
        fuzzyMatchResult = await groupInfoModel.fuzzyMatchGroups(field);
      }
      io.to(socketId).emit('fuzzyMatchRes', { fuzzyMatchResult, searchUser: data.searchUser });
    });

    // qiniu token
    socket.on('getQiniuToken', async (fn) => {
      const uploadToken = await getUploadToken();
      console.log('uploadToken233', uploadToken);
      return fn(uploadToken);
    });

    /**
     * 加为好友
     * @param  user_id  本机用户
     *         from_user  本机用户的朋友（对方）
     */
    socket.on('beFriend', async (data) => {
      const { user_id, from_user } = data;
      const time = Date.parse(new Date()) / 1000;
      await userInfoModel.addFriendEachOther(user_id, from_user, time);
    });

    socket.on('disconnect', (data) => {
      console.log('disconnect', data);
    });
  });
};
