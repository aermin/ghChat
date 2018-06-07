/**
 * @file 处理验证的中间件
 */

const jwt = require("jsonwebtoken");
const secret = require("../config").secret;

module.exports = async function(ctx, next) {
	// 同步验证
	const auth = ctx.get('Authorization')
	const token = auth.split(' ')[1];
	try {
		//解码取出之前存在payload的user_id 和 name
		const payload = jwt.verify(token, secret)
		ctx.user_id = payload.id;
		ctx.name = payload.name;
		await next()
	} catch (err) {
		ctx.throw(401, err)
	}
}