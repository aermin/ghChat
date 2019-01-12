const md5 = require('md5');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;
const userModel = require('../models/userInfo');

module.exports = async ({
  io, name, password, socketId
}) => {
  if (name === '' || password === '') {
    io.to(socketId).emit('login', {
      errorCode: -1,
      message: '用户名或密码不能为空'
    });
    return;
  }
  const RowDataPacket = await userModel.findDataByName(name);
  const res = JSON.parse(JSON.stringify(RowDataPacket));
  if (res.length > 0) {
    //   验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端
    if (md5(password) === res[0].password) {
      const {
        id, name, sex, website, github, intro, avatar, place, socketid
      } = res[0];
      const payload = { // payload
        name,
        id
      };
      const token = jwt.sign(payload, secret, {
        expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 一天
      });
      const data = {
        errorCode: 0,
        message: '登录成功',
        userInfo: {
          name,
          user_id: id,
          sex,
          website,
          github,
          intro,
          avatar,
          place,
          socketId,
          token
        }
      };
      io.to(socketId).emit('login', data);
    } else {
      io.to(socketId).emit('login', {
        errorCode: -1,
        message: '密码错误'
      });
    }
  } else {
    io.to(socketId).emit('login', {
      errorCode: -1,
      message: '用户名错误'
    });
  }
};
