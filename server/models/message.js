const {
  query
} = require('../utils/db');

// 通过user_id查找首页群列表
// TODO： 优化sql语句
const getGroupList = (user_id) => {
  const _sql = `SELECT r.to_group_id ,i.name , i.create_time, i.avatar ,
    (SELECT g.message  FROM group_msg AS g  WHERE g.to_group_id = r.to_group_id  ORDER BY TIME DESC   LIMIT 1 )  AS message ,
    (SELECT g.time  FROM group_msg AS g  WHERE g.to_group_id = r.to_group_id  ORDER BY TIME DESC   LIMIT 1 )  AS time,
    (SELECT g.attachments FROM group_msg AS g  WHERE g.to_group_id = r.to_group_id  ORDER BY TIME DESC   LIMIT 1 )  AS attachments
    FROM  group_user_relation AS r inner join group_info AS i on r.to_group_id = i.to_group_id WHERE r.user_id = ? `;
  return query(_sql, user_id);
};

// 通过user_id查找首页私聊列表
// TODO： 优化sql语句
const getPrivateList = (user_id) => {
  const _sql = ` SELECT r.from_user as user_id, i.name, i.avatar, i.github_id, r.time as be_friend_time,
    (SELECT p.message FROM private__msg AS p WHERE (p.to_user = r.from_user and p.from_user = r.user_id) or (p.from_user = r.from_user and p.to_user = r.user_id) ORDER BY p.time DESC   LIMIT 1 )  AS message ,
    (SELECT p.time FROM private__msg AS p WHERE (p.to_user = r.from_user and p.from_user = r.user_id) or (p.from_user = r.from_user and p.to_user = r.user_id) ORDER BY p.time DESC   LIMIT 1 )  AS time,
    (SELECT p.attachments FROM private__msg AS p WHERE (p.to_user = r.from_user and p.from_user = r.user_id) or (p.from_user = r.from_user and p.to_user = r.user_id) ORDER BY p.time DESC   LIMIT 1 )  AS attachments
    FROM  user_user_relation AS r inner join user_info AS i on r.from_user  = i.id WHERE r.user_id = ?  `;
  return query(_sql, user_id);
};

module.exports = {
  getGroupList,
  getPrivateList
};
