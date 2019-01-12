const jwt = require('jsonwebtoken');
const secret = require('../config').secret;
const userModel = require('../models/userInfo');
const md5 = require('md5');

module.exports = async (ctx, next) => {
  const name = ctx.request.body.name || '';
  const password = ctx.request.body.password || '';
  if (name === '' || password === '') {
    ctx.body = {
      success: false,
      message: '用户名或密码不能为空'
    };
    return;
  }
  const RowDataPacket = await userModel.findDataByName(name);
  const res = JSON.parse(JSON.stringify(RowDataPacket));
  if (res.length > 0) {
    //   验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端
    if (md5(password) === res[0].password) {
      const {
        id, name, sex, website, github, intro, avatar, place, socketId
      } = res[0];
      const payload = { id };
      const token = jwt.sign(payload, secret, {
        expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 一天
      });
      ctx.body = {
        success: true,
        message: '登录成功',
        userInfo: {
          name,
          userId: id,
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
    } else {
      ctx.body = {
        success: false,
        message: '密码错误'
      };
    }
  } else {
    ctx.body = {
      success: false,
      message: '用户名错误'
    };
  }
};
