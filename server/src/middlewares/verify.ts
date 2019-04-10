/**
 * @file 处理验证的中间件
 */

const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

module.exports = (token) => {
  try {
    // 解码取出之前存在payload的user_id
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (err) {
    // ctx.throw(401, err);
    console.error(err);
    return false;
  }
};
