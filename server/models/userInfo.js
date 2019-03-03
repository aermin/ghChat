const {
  query
} = require('../utils/db');

// 模糊匹配用户
const fuzzyMatchUsers = (link) => {
  const _sql = `
    SELECT * FROM user_info WHERE name LIKE ?;
  `;
  return query(_sql, link);
};

// 注册用户
const insertData = (value) => {
  const _sql = 'insert into user_info(name,password) values(?,?);';
  return query(_sql, value);
};

// 添加github用户
const insertGithubData = ({
  name, github_id, avatar, location, website, github, intro
}) => {
  const _sql = 'insert into user_info(name, github_id, avatar, location, website, github, intro) values(?,?,?,?,?,?,?);';
  return query(_sql, [name, github_id, avatar, location, website, github, intro]);
};

// 通过github_id查找 github用户信息
const findGithubUser = (githubId) => {
  const _sql = 'SELECT * FROM user_info WHERE github_id = ? ;';
  return query(_sql, githubId);
};

// 更新 github 用户信息
const updateGithubUser = ({
  name, avatar, location, website, github, intro, github_id
}) => {
  const _sql = ' UPDATE  user_info SET name = ?,avatar = ?,location = ?,website = ?,github = ?,intro= ? WHERE github_id = ? ; ';
  return query(_sql, [name, avatar, location, website, github, intro, github_id]);
};

// 通过用户名查找非github用户信息 user_info
const findDataByName = (name) => {
  const _sql = 'SELECT * FROM user_info WHERE name = ? and github_id IS NULL;';
  return query(_sql, name);
};

// 通过用户名查找用户信息 user_info 不包括密码
// const findUIByName = (name) => {
//   const _sql = 'SELECT id ,name ,sex,avatar,location,github FROM user_info WHERE name = ? ';
//   return query(_sql, name);
// };

// 更新登录状态
const updateUserStatus = (user_id, status) => {
  const _sql = 'UPDATE user_info SET status = ? WHERE id= ? limit 1;';
  return query(_sql, [status, user_id]);
};

// 修改我的信息
// const editorInfo = (data) => {
//   const _sql = ' UPDATE  user_info SET github = ?,website = ?,sex = ?,location = ? WHERE id = ? ; ';
//   return query(_sql, data);
// };

// 通过用户id查找用户信息 user_info 包括密码
// const findDataByUserid = (user_id) => {
//   const _sql = 'SELECT * FROM user_info WHERE id= ? ';
//   return query(_sql, [userid]);
// };

// 通过用户id查找用户信息 user_info 包括用户名，性别，头像，最后登录时间，状态等，不包括密码
const getUserInfo = (user_id) => {
  const _sql = 'SELECT id AS user_id, name, avatar, location, website, github, github_id, intro, status  FROM user_info   WHERE  user_info.id =? ';
  return query(_sql, [user_id]);
};

// 通过要查看的用户id 查询是否是本机用户的好友  如果是 返回user_id 和 remark 备注
const isFriend = (user_id, from_user) => {
  const _sql = 'SELECT  * FROM user_user_relation  AS u WHERE  u.user_id = ? AND u.from_user = ? ';
  return query(_sql, [user_id, from_user]);
};

// 加为好友 单方面 (之后可能会加上开启好友验证的功能)
// const addAsFriend = (user_id, from_user, time) => {
//   const _sql = 'INSERT INTO user_user_relation(user_id,from_user,time) VALUES (?,?,?)';
//   return query(_sql, [user_id, from_user, time]);
// };

// 两边都互加为好友
const addFriendEachOther = (user_id, from_user, time) => {
  const _sql = 'INSERT INTO user_user_relation(user_id,from_user,time) VALUES (?,?,?), (?,?,?)';
  return query(_sql, [user_id, from_user, time, from_user, user_id, time]);
};

// 删除好友
const delFriend = (user_id, from_user) => {
  const _sql = 'DELETE FROM  user_user_relation WHERE user_id = ? AND from_user = ?';
  return query(_sql, [user_id, from_user]);
};

// 屏蔽好友
// const shieldFriend = (status, user_id, from_user) => {
//   const _sql = 'UPDATE  user_user_relation  SET shield = ?  WHERE  user_id = ? AND from_user = ? ';
//   return query(_sql, [status, user_id, from_user]);
// };

// // 修改备注
// const editorRemark = (remark, user_id, from_user) => {
//   const _sql = 'UPDATE  user_user_relation  SET remark = ?  WHERE  user_id = ? AND from_user = ? ';
//   return query(_sql, [remark, user_id, from_user]);
// };


module.exports = {
  fuzzyMatchUsers,
  insertData,
  findDataByName,
  // findUIByName,
  getUserInfo,
  isFriend,
  addFriendEachOther,
  delFriend,
  updateGithubUser,
  findGithubUser,
  insertGithubData,
  updateUserStatus,
};
