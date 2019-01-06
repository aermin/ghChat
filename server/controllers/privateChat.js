const privateChatModel = require('../models/privateChat');
const userModel = require('../models/userInfo');
/**
 * 获取私聊相关内容
 * @param  to_user 信息发送者的id
 * @param  from_user 信息接收者的id
 * @return  from_user  此条信息的发送者
 *          message 私聊信息
 *          time 时间
 *          avatar 发送者的头像
 *          sex 发送者的性别
 *          place 发送者居住地
 *         status 发送者的是否在线
 */

const getprivateDetail = async (ctx, next) => {
  const to_user = ctx.query.to_user;
  const from_user = ctx.user_id;
  const RowDataPacket1 = await privateChatModel.getPrivateDetail(from_user, to_user);
  const RowDataPacket2 = await userModel.getUserInfo(to_user);
  const message = JSON.parse(JSON.stringify(RowDataPacket1));
  const userInfo = JSON.parse(JSON.stringify(RowDataPacket2));
  ctx.body = {
    success: true,
    data: {
      message,
      userInfo: userInfo[0]
    }
  };
};


/**
 * 存储私聊聊信息
 * @param   to_user  信息发送者的id
 * @param   from_user 信息接收者的id
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */
const savePrivateMsg = async (ctx, next) => {
  const from_user = ctx.user_id;
  const to_user = ctx.request.body.to_user;
  const message = ctx.request.body.message;
  const name = ctx.request.body.name;
  const time = ctx.request.body.time;
  await privateChatModel.savePrivateMsg({
    from_user, to_user, message, name, time
  })
    .then((result) => {
      console.log('privateChatModel11', result);
      if (result) {
        ctx.body = {
          success: true
        };
        console.log('保存私聊消息成功');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getprivateDetail,
  savePrivateMsg
};
