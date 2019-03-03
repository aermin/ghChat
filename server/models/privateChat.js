const { query } = require('../utils/db');


/**
 * 获取私聊相关内容
 * @param  to_user 私聊对象的id
 * @param  from_user 私聊者自己的id
 * @return  from_user  此条信息的发送者
 *          to_user 此条信息的接收者
 *          message 私聊信息
 *          time 时间
 *          avatar 发送者的头像
//  *          sex 发送者的性别
//  *          location 发送者居住地
 *         status 发送者的是否在线
 */
const getPrivateDetail = (from_user, to_user, start, count) => {
  const data = [from_user, to_user, to_user, from_user, start, count];
  const _sql = 'SELECT * FROM ( SELECT p.from_user,p.to_user,p.message,p.attachments,p.time,i.avatar,i.name,i.status, i.github_id from private__msg as p  inner join user_info as i  on p.from_user = i.id  where  (p.from_user = ? AND p.to_user   = ? )  or (p.from_user = ? AND p.to_user   = ? )  order by time desc limit ?,? ) as n order by n.time';
  return query(_sql, data);
};

/**
 * 存聊天记录
 * @param   from_user  发送者id
 * @param   to_user  接收者id
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */

const savePrivateMsg = ({
  from_user, to_user, message, time, attachments
}) => {
  const data = [from_user, to_user, message, time, attachments];
  const _sql = ' INSERT INTO private__msg(from_user,to_user,message,time,attachments)  VALUES(?,?,?,?,?); ';
  return query(_sql, data);
};

module.exports = {
  getPrivateDetail,
  savePrivateMsg
};
