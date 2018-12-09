const {
  query
} = require('../utils/db');

// 通过user_id查找首页群列表
const getGroupList = function (user_id) {
  const _sql = `SELECT r.group_id ,i.group_name , i.creater_time, i.group_avator ,
    (SELECT g.message  FROM group_msg AS g  WHERE g.to_group = r.group_id  ORDER BY TIME DESC   LIMIT 1 )  AS message ,
    (SELECT g.time  FROM group_msg AS g  WHERE g.to_group = r.group_id  ORDER BY TIME DESC   LIMIT 1 )  AS time
    FROM  group_user_relation AS r  inner join group_info AS i on r.group_id = i.group_id   WHERE r.user_id = ? `;
  return query(_sql, user_id);
};

// 通过user_id查找首页私聊列表
const getPrivateList = function (user_id) {
  const _sql = ` SELECT r.from_user  ,i.name , i.avator , r.time as be_friend_time,
    (SELECT p.message  FROM private__msg AS p
    WHERE (p.to_user = r.from_user and p.from_user = r.user_id) or  (p.from_user = r.from_user and p.to_user = r.user_id)  ORDER BY p.time DESC   LIMIT 1 )  AS message ,
    (SELECT p.time  FROM private__msg AS p  WHERE  (p.to_user = r.from_user and p.from_user = r.user_id) or  (p.from_user = r.from_user and p.to_user = r.user_id)   ORDER BY p.time DESC   LIMIT 1 )  AS time
    FROM  user_user_relation AS r  inner join user_info AS i on r.from_user  = i.id   WHERE r.user_id = ?  `;
  return query(_sql, user_id);
};

module.exports = {
  getGroupList,
  getPrivateList
};
