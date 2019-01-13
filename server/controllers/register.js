const md5 = require('md5');
const userModel = require('../models/userInfo');

module.exports = async (ctx, next) => {
  console.log('register');
  const { name, password } = ctx.request.body;

  await userModel.findDataByName(name).then((result) => {
    console.log(result);
    if (result.length) {
      ctx.body = {
        success: false,
        message: '用户名已存在'
      };
    } else {
      ctx.body = {
        success: true,
        message: '注册成功！'
      };
      console.log('注册成功');
      userModel.insertData([name, md5(password)]);
    }
  });
};
