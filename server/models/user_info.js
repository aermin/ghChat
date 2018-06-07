const {
	query
} = require('../utils/db');

// 注册用户
let insertData = function(value) {
	let _sql = "insert into user_info(name,password) values(?,?);"
	return query(_sql, value)
}

// 通过用户名查找用户信息 user_info
let findDataByName = function(name) {
	let _sql = 'SELECT * FROM user_info WHERE name= ? '
	return query(_sql, name)
}

// 通过用户名查找用户信息 user_info 不包括密码
let findUIByName = function(name) {
	let _sql = 'SELECT id ,name ,sex,avator,place,github FROM user_info WHERE name = ? '
	return query(_sql, name)
}

//修改我的信息
let editorInfo = function(data) {
	let _sql = ' UPDATE  user_info SET github = ?,website = ?,sex = ?,place = ? WHERE id = ? ; '
	return query(_sql, data)
}

// 通过用户id查找用户信息 user_info 包括密码
let findDataByUserid = function(userid) {
	let _sql = 'SELECT * FROM user_info WHERE id= ? '
	return query(_sql, [userid])
}

// 通过用户id查找用户信息 user_info 包括用户名，性别，头像，最后登录时间，状态等，不包括密码
let getUserInfo = (user_id) => {
	const _sql =
		'SELECT id AS user_id, name ,sex ,avator,place ,website,github,intro,status,last_login  FROM user_info   WHERE  user_info.id =? '
	return query(_sql, [user_id]);
}

// 通过要查看的用户id 查询是否是本机用户的好友  如果是 返回user_id 和 remark 备注
let isFriend = (user_id, other_user_id) => {
	const _sql =
		'SELECT  * FROM user_user_relation  AS u WHERE  u.user_id = ? AND u.other_user_id = ? '
	return query(_sql, [user_id, other_user_id]);
}

// 加为好友 单方面
let addAsFriend = (user_id, other_user_id, time) => {
	const _sql =
		'INSERT INTO user_user_relation(user_id,other_user_id,time) VALUES (?,?,?)'
	return query(_sql, [user_id, other_user_id, time]);
}

//两边都互加为好友
// let addFriendEachOther = (user_id,other_user_id)=>{
//     const _sql =
//   'INSERT INTO user_user_relation(user_id,other_user_id) VALUES (?,?)'
//     return query(_sql, [user_id,other_user_id]);
// }

// 删除好友
let delFriend = (user_id, other_user_id) => {
	const _sql =
		'DELETE FROM  user_user_relation WHERE user_id = ? AND other_user_id = ?'
	return query(_sql, [user_id, other_user_id]);
}

//屏蔽好友
let shieldFriend = (status, user_id, other_user_id) => {
	const _sql =
		'UPDATE  user_user_relation  SET shield = ?  WHERE  user_id = ? AND other_user_id = ? '
	return query(_sql, [status, user_id, other_user_id]);
}

//修改备注
let editorRemark = (remark, user_id, other_user_id) => {
	const _sql =
		'UPDATE  user_user_relation  SET remark = ?  WHERE  user_id = ? AND other_user_id = ? '
	return query(_sql, [remark, user_id, other_user_id]);
}


module.exports = {
	insertData,
	findDataByName,
	findUIByName,
	getUserInfo,
	isFriend,
	addAsFriend,
	delFriend,
	shieldFriend,
	editorRemark,
	editorInfo
}