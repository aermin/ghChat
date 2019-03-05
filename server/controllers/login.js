const jwt = require('jsonwebtoken');
const md5 = require('md5');
const secret = require('../config').secret;
const userModel = require('../models/userInfo');

// 用户名登录系统只涉及非github用户，也就是github用户只能走github授权来登录
module.exports = async (ctx, next) => {
  const { name = '', password = '' } = ctx.request.body;
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
        id, name, sex, website, github, intro, avatar, location, socketId
      } = res[0];
      const payload = { id };
      const token = jwt.sign(payload, secret, {
        expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 7 // 一周
      });
      ctx.body = {
        success: true,
        message: '登录成功',
        userInfo: {
          name,
          user_id: id,
          sex,
          website,
          github,
          intro,
          avatar,
          location,
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
