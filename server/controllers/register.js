let userModel = require("../models/user_info");
let md5 = require("md5");

module.exports = async (ctx, next) => {
  console.log("register");
  var user = {
    name: ctx.request.body.name,
    password: ctx.request.body.password
  };

  await userModel.findDataByName(user.name).then(result => {
    console.log(result);
    if (result.length) {
      ctx.body = {
        success: false,
        message: "用户名已存在"
      };
    } else {
    ctx.body = {
        success: true,
        message: "注册成功！"
      };
      console.log("注册成功");
      userModel.insertData([
        ctx.request.body.name,
        md5(ctx.request.body.password)
      ]);
    }
  });
};
