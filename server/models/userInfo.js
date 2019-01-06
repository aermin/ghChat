const {
  query
} = require('../utils/db');

// 注册用户
const insertData = (value) => {
  const _sql = 'insert into user_info(name,password) values(?,?);';
  return query(_sql, value);
};

// 通过用户名查找用户信息 user_info
const findDataByName = (name) => {
  const _sql = 'SELECT * FROM user_info WHERE name= ? ';
  return query(_sql, name);
};

// 通过用户名查找用户信息 user_info 不包括密码
const findUIByName = (name) => {
  const _sql = 'SELECT id ,name ,sex,avatar,place,github FROM user_info WHERE name = ? ';
  return query(_sql, name);
};

// 修改我的信息
const editorInfo = (data) => {
  const _sql = ' UPDATE  user_info SET github = ?,website = ?,sex = ?,place = ? WHERE id = ? ; ';
  return query(_sql, data);
};

// 通过用户id查找用户信息 user_info 包括密码
const findDataByUserid = (userid) => {
  const _sql = 'SELECT * FROM user_info WHERE id= ? ';
  return query(_sql, [userid]);
};

// 通过用户id查找用户信息 user_info 包括用户名，性别，头像，最后登录时间，状态等，不包括密码
const getUserInfo = (user_id) => {
  const _sql = 'SELECT id AS user_id, name ,sex ,avatar,place ,website,github,intro,status  FROM user_info   WHERE  user_info.id =? ';
  return query(_sql, [user_id]);
};

// 通过要查看的用户id 查询是否是本机用户的好友  如果是 返回user_id 和 remark 备注
const isFriend = (user_id, from_user) => {
  const _sql = 'SELECT  * FROM user_user_relation  AS u WHERE  u.user_id = ? AND u.from_user = ? ';
  return query(_sql, [user_id, from_user]);
};

// 加为好友 单方面
const addAsFriend = (user_id, from_user, time) => {
  const _sql = 'INSERT INTO user_user_relation(user_id,from_user,time) VALUES (?,?,?)';
  return query(_sql, [user_id, from_user, time]);
};

// 两边都互加为好友
// let addFriendEachOther = (user_id,from_user)=>{
//     const _sql =
//   'INSERT INTO user_user_relation(user_id,from_user) VALUES (?,?)'
//     return query(_sql, [user_id,from_user]);
// }

// 删除好友
const delFriend = (user_id, from_user) => {
  const _sql = 'DELETE FROM  user_user_relation WHERE user_id = ? AND from_user = ?';
  return query(_sql, [user_id, from_user]);
};

// 屏蔽好友
const shieldFriend = (status, user_id, from_user) => {
  const _sql = 'UPDATE  user_user_relation  SET shield = ?  WHERE  user_id = ? AND from_user = ? ';
  return query(_sql, [status, user_id, from_user]);
};

// 修改备注
const editorRemark = (remark, user_id, from_user) => {
  const _sql = 'UPDATE  user_user_relation  SET remark = ?  WHERE  user_id = ? AND from_user = ? ';
  return query(_sql, [remark, user_id, from_user]);
};


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
};
