const jwt = require("jsonwebtoken");
const secret = require("../config").secret;
const msgModel = require("../models/message");

module.exports = async (ctx, next) => {
	try {
		const res1 = await msgModel.getPrivateList(ctx.user_id);
		const privateList = JSON.parse(JSON.stringify(res1));
		const res2 = await msgModel.getGroupList(ctx.user_id);
		const groupList = JSON.parse(JSON.stringify(res2));
		ctx.body = {
			success: true,
			data: {
				privateList: privateList,
				groupList: groupList
			}
		};
	} catch (error) {
		console.log(error);
	}
};