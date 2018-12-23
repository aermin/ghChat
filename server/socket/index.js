
const socketIo = require('socket.io');
const socketModel = require('../models/socket');
const { savePrivateMsg } = require('../models/privateChat');
const { saveGroupMsg } = require('../models/groupChat');
const msgModel = require('../models/message');
const initMessage = require('./message');

module.exports = (server) => {
  const io = socketIo(server);
  io.on('connection', (socket) => {
    const socketId = socket.id;
    // 登录
    socket.on('login', async (userId) => {
      await socketModel.saveUserSocketId(userId, socketId);
    });
    // 更新soketId
    socket.on('update', async (userId) => {
      await socketModel.saveUserSocketId(userId, socketId);
    });

    // 初始化群聊
    socket.on('initGroupChat', async (data) => {
      console.log('initGroupChat', data);
      const result = await msgModel.getGroupList(data.userId);
      const groupList = JSON.parse(JSON.stringify(result));
      for (const item of groupList) {
        socket.join(item.group_id);
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
      socket.broadcast.to(data.to_group).emit('getGroupMsg', data);
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
