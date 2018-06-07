const privateChatModel = require("../models/privateChat");

/**
 * 获取私聊相关内容
 * @param  to_user 信息发送者的id
 * @param  from_user 信息接收者的id
 * @return  from_user  此条信息的发送者
 *          message 私聊信息
 *          time 时间
 *          avator 发送者的头像
 *          sex 发送者的性别
 *          place 发送者居住地
 *         status 发送者的是否在线
 */

let getprivateDetail = async (ctx, next) => {
	const to_user = ctx.query.to_user,
		from_user = ctx.user_id,
		RowDataPacket = await privateChatModel.getPrivateDetail(from_user, to_user),
		privateDetail = JSON.parse(JSON.stringify(RowDataPacket));
	ctx.body = {
		success: true,
		data: {
			privateDetail: privateDetail
		}
	};
}


/**
 * 存储私聊聊信息
 * @param   to_user  信息发送者的id
 * @param   from_user 信息接收者的id
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */
let savePrivateMsg = async (ctx, next) => {
	const from_user = ctx.user_id,
		to_user = ctx.request.body.to_user,
		message = ctx.request.body.message,
		name = ctx.request.body.name,
		time = ctx.request.body.time;
	await privateChatModel.savePrivateMsg(from_user, to_user, message, name, time)
		.then(result => {
			console.log("privateChatModel11", result);
			if (result) {
				ctx.body = {
					success: true
				};
				console.log("保存私聊消息成功");
			}
		})
		.catch(err => {
			console.log(err);
		});
};

module.exports = {
	getprivateDetail,
	savePrivateMsg
};