
const socketIo = require('socket.io');
const uuid = require('uuid/v1');
const socketModel = require('../models/socket');
const { savePrivateMsg } = require('../models/privateChat');
const { saveGroupMsg } = require('../models/groupChat');
const msgModel = require('../models/message');
const groupInfo = require('../models/groupInfo');
const initMessage = require('./message');
// const login = require('./login');

// module.exports = server => (ctx) => {
module.exports = (server) => {
  // console.log('ctx233', ctx);
  const io = socketIo(server);
  io.on('connection', (socket) => {
    const socketId = socket.id;
    socket.on('saveSocketIdByUserId', async (userId) => {
      // const { name, password, userId } = data;
      // await login({
      //   io, name, password, socketId
      // });
      await socketModel.saveUserSocketId(userId, socketId);
    });
    // // 更新soketId
    // socket.on('update', async (userId) => {
    //   await socketModel.saveUserSocketId(userId, socketId);
    // });

    // 初始化群聊
    socket.on('initGroupChat', async (data) => {
      console.log('initGroupChat', data);
      const result = await msgModel.getGroupList(data.userId);
      const groupList = JSON.parse(JSON.stringify(result));
      for (const item of groupList) {
        socket.join(item.to_group_id);
      }
    });

    socket.on('initMessage', async (userId) => {
      const data = await initMessage({ userId });
      console.log('initMessage', data);
      io.to(socketId).emit('getAllMessage', data);
    });

    // 私聊
    socket.on('sendPrivateMsg', async (data) => {
      if (!data) return;
      await savePrivateMsg({ ...data });
      const arr = await socketModel.getUserSocketId(data.to_user);
      const RowDataPacket = arr[0];
      const socketId = JSON.parse(JSON.stringify(RowDataPacket)).socketid;
      console.log('socketId2333', socketId);
      io.to(socketId).emit('getPrivateMsg', data);
    });
    // 群聊
    socket.on('sendGroupMsg', async (data) => {
      if (!data) return;
      await saveGroupMsg({ ...data });
      console.log('sendGroupMsg', data);
      socket.broadcast.to(data.to_group_id).emit('getGroupMsg', data);
    });

    // 建群
    socket.on('createGroup', async (data) => {
      const to_group_id = uuid();
      const {
        name, group_notice, creator, create_time
      } = data;
      const avatar = 'https://user-images.githubusercontent.com/24861316/47977783-fdd46f80-e0f4-11e8-93ec-8b0a1268c1e3.jpeg';
      const arr = [to_group_id, name, group_notice, avatar, creator, create_time];
      await groupInfo.createGroup(arr);
      await groupInfo.joinGroup(data.creator_id, to_group_id);
      io.to(socketId).emit('createGroupRes', { to_group_id, avatar, ...data });
    });

    // 加好友请求
    socket.on('sendRequest', async (data) => {
      console.log('sendRequest', data);
      const arr = await socketModel.getUserSocketId(data.to_user);
      const RowDataPacket = arr[0];
      const socketId = JSON.parse(JSON.stringify(RowDataPacket)).socketid;
      console.log('给谁的socketid', socketId);
      io.to(socketId).emit('getresponse', data);
    });

    socket.on('disconnect', (data) => {
      console.log('disconnect', data);
    });
  });
};
