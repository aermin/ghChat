const groupInfo = require("../models/groupInfo");
const uuidv1 = require('uuid/v1');

/**
 * 加入群
 * @param   user_id  用户id
 * @param   group_id  群id
 * @return
 */

let joinGroup = async (ctx, next) => {
	await groupInfo.joinGroup(ctx.user_id, ctx.request.body.group_id)
		.then((res) => {
			ctx.body = {
				success: true
			};
			console.log("加入群成功");
		});
};

/**
 * 查看某个用户是否在某个群中(根据返回的数组长度是不是为零就知道)
 * @param   user_id  用户id
 * @param   group_id  群id
 * @return
 */
let isInGroup = async (ctx, next) => {
	const RowDataPacket = await groupInfo.isInGroup(
			ctx.user_id,
			ctx.query.group_id
		),
		group_user = JSON.parse(JSON.stringify(RowDataPacket));
	ctx.body = {
		success: true,
		data: {
			group_user: group_user
		}
	};
};

/**
 * [createGroup 建群]
 * @param  {[type]}   ctx  [群名，群公告，群头像，创建人，创建时间]
 * @param  {Function} next [description]
 * @return {Promise}       [description]
 */
let createGroup = async (ctx, next) => {
	const uuid = uuidv1();
	console.log('uuid', uuid)
	const arr = [uuid, ctx.request.body.group_name, ctx.request.body.group_notice, ctx.request.body.group_avator, ctx.name, ctx.request.body.creater_time];
	await groupInfo.createGroup(arr);
	ctx.body = {
		success: true,
		data: {
			group_id: uuid
		}
	};
};

/**
 * [delGroup 退出群]
 * @param  {[type]}   ctx  [用户id，群id]
 * @param  {Function} next [description]
 * @return {Promise}       [success: true]
 */
let exitGroup = async (ctx, next) => {
	await groupInfo.exitGroup(ctx.user_id, ctx.query.group_id);
	ctx.body = {
		success: true
	};
	console.log('退群成功')
};

module.exports = {
	joinGroup,
	isInGroup,
	createGroup,
	exitGroup
};