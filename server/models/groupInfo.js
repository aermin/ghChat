const {
  query
} = require('../utils/db');


// 加入群
const joinGroup = (user_id, group_id) => {
  const _sql = 'INSERT INTO group_user_relation(user_id,group_id) VALUES(?,?);';
  return query(_sql, [user_id, group_id]);
};

// 查看某个用户是否在某个群中
const isInGroup = (user_id, group_id) => {
  const _sql = 'SELECT * FROM group_user_relation WHERE user_id = ? AND group_id = ?;';
  return query(_sql, [user_id, group_id]);
};

// 建群
const createGroup = (arr) => {
  const _sql = 'INSERT INTO group_info (group_id,group_name,group_notice,group_avator,group_creater,create_time) VALUES (?,?,?,?,?,?)';
  return query(_sql, arr);
};

// 删除群
const exitGroup = (user_id, group_id) => {
  const _sql = 'DELETE FROM  group_user_relation WHERE user_id = ? AND group_id = ? ;';
  return query(_sql, [user_id, group_id]);
};


module.exports = {
  joinGroup,
  isInGroup,
  createGroup,
  exitGroup
};
