const userModel = require("../models/user_info");

/**
 *  通过user_id获取用户信息 （不包括密码）
 * @param
 * @return 用户名，性别，头像，最后登录时间，状态等
 */

let getUserInfo = async (ctx, next) => {
	const RowDataPacket = await userModel.getUserInfo(ctx.query.user_id),
		userInfo = JSON.parse(JSON.stringify(RowDataPacket));
	ctx.body = {
		success: true,
		data: {
			userInfo: userInfo
		}
	};
};

/**
 *  通过用户名获取用户信息 （不包括密码）
 * @param
 * @return id，用户名，性别，头像，地方，github
 */

let findUIByName = async (ctx, next) => {
	const RowDataPacket = await userModel.findUIByName(ctx.query.name),
		userInfo = JSON.parse(JSON.stringify(RowDataPacket));
	ctx.body = {
		success: true,
		data: {
			userInfo: userInfo
		}
	};
};

/**
 * 通过要查看的用户id 查询是否是本机用户的好友
 * @param  user_id  other_user_id
 * @return  如果是 返回 user_id  other_user_id 和 remark 备注
 *         否则返回空
 */

let isFriend = async (ctx, next) => {
	const RowDataPacket1 = await userModel.isFriend(
			ctx.user_id,
			ctx.query.other_user_id
		),
		RowDataPacket2 = await userModel.isFriend(
			ctx.query.other_user_id,
			ctx.user_id
		),
		isMyFriend = JSON.parse(JSON.stringify(RowDataPacket1)),
		isHisFriend = JSON.parse(JSON.stringify(RowDataPacket2));
	ctx.body = {
		success: true,
		data: {
			isMyFriend: isMyFriend,
			isHisFriend: isHisFriend
		}
	};
};

/**
 * 加为好友
 * @param  user_id  本机用户
 *         other_user_id  本机用户的朋友（对方）
 * @return
 *
 */
let agreeBeFriend = async (ctx, next) => {
	const RowDataPacket1 = await userModel.isFriend(
			ctx.user_id,
			ctx.request.body.other_user_id
		),
		RowDataPacket2 = await userModel.isFriend(
			ctx.request.body.other_user_id,
			ctx.user_id
		),
		isMyFriend = JSON.parse(JSON.stringify(RowDataPacket1)),
		isHisFriend = JSON.parse(JSON.stringify(RowDataPacket2));
	console.log("isMyFriend", isMyFriend);
	console.log("isHisFriend", isHisFriend);
	//变成本机用户的朋友
	if (isMyFriend.length === 0) {
		await userModel.addAsFriend(
			ctx.user_id,
			ctx.request.body.other_user_id,
			ctx.request.body.time
		);
	}
	//本机用户变成ta的朋友
	if (isHisFriend.length === 0) {
		await userModel.addAsFriend(
			ctx.request.body.other_user_id,
			ctx.user_id,
			ctx.request.body.time
		);
	}
	ctx.body = {
		success: true
	};
	console.log("添加好友成功");
};

/**
 * 删除好友
 * @param  user_id  本机用户id
 *         other_user_id  对方id
 * @return
 */
let delFriend = async (ctx, next) => {
	await userModel.delFriend(ctx.user_id, ctx.query.other_user_id)
		.then(result => {
			if (result) {
				ctx.body = {
					success: true
				};
				console.log("删除好友成功");
			}
		})
		.catch(err => {
			console.log(err);
		});
};

/**
 * 屏蔽好友
 * @param  status   0为不屏蔽  1为屏蔽
 *         user_id  本机用户id
 *         other_user_id  对方id
 * @return
 */
let shieldFriend = async (ctx, next) => {
	await userModel.delFriend(
			ctx.request.body.status,
			ctx.request.body.user_id,
			ctx.request.body.other_user_id
		).then(result => {
			console.log("shieldFriend", result);
			if (result) {
				ctx.body = {
					success: true
				};
				console.log("(取消)屏蔽好友成功");
			}
		})
		.catch(err => {
			console.log(err);
		});
};

/**
 * 修改备注
 * @param  remark   备注
 *         user_id  本机用户id
 *         other_user_id  对方id
 * @return
 */
let editorRemark = async (ctx, next) => {
	await userModel.editorRemark(
			ctx.request.body.remark,
			ctx.user_id,
			ctx.request.body.other_user_id
		).then(result => {
			console.log("editorRemark", result);
			if (result) {
				ctx.body = {
					success: true
				};
				console.log("修改备注成功");
			}
		})
		.catch(err => {
			console.log(err);
		});
};

/**
 * 修改备注
 * @param  github   github
 * 			website website
 * 			sex 性别
 * 			place 来自哪里
 * 			user_id  本机用户id
 * @return
 */
let editorInfo = async (ctx, next) => {
	const data = [ctx.request.body.github, ctx.request.body.website, ctx.request.body.sex, ctx.request.body.place, ctx.user_id]
	console.log('editorInfo', data)
	await userModel.editorInfo(data).then(result => {
			console.log("editorInfo", result);
			if (result) {
				ctx.body = {
					success: true
				};
				console.log("修改个人信息成功");
			}
		})
		.catch(err => {
			console.log(err);
		});
};

module.exports = {
	getUserInfo,
	findUIByName,
	isFriend,
	agreeBeFriend,
	delFriend,
	shieldFriend,
	editorRemark,
	editorInfo
};