const {
  query
} = require('../utils/db');
/**
 * 获取群消息
 * @param  群id
 * @return  message 群消息
 * @return  time  时间
 * @return  from_user  发送人id
 *  @return  avator  发送人头像
 */
const getGroupMsg = function (groupId) {
  const _sql = 'SELECT g.message , g.time , g.from_user, g.to_group, i.avator ,i.name FROM group_msg  As g inner join user_info AS i ON g.from_user = i.id  WHERE to_group = ? order by time ';
  return query(_sql, groupId);
};
/**
 * 获取群成员
 * @param   群id
 * @return  group_member_id  群成员id
 */
const getGroupMember = function (groupId) {
  const _sql = ' SELECT user_id AS group_member_id  FROM group_user_relation  WHERE group_id = ? ';
  return query(_sql, groupId);
};
/**
 * 获取群资料
 * @param   arr 包括 groupId  goupName 至少一个
 * @return
 */
const getGroupInfo = function (arr) {
  const _sql = ' SELECT group_id , group_name , group_notice ,group_avator ,group_creater ,creater_time FROM group_info  WHERE group_id = ? OR group_name = ? ;';
  return query(_sql, arr);
};

/**
 * 存聊天记录
 * @param   userId  用户id
 * @param   groupId 群id
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */

const saveGroupMsg = function (userId, groupId, message, name, time) {
  const data = [userId, groupId, `${name} : ${message}`, time];
  const _sql = ' INSERT INTO group_msg(from_user,to_group,message ,time) VALUES(?,?,?,?); ';
  return query(_sql, data);
};
/**
 * 群添加成员并返回群成员
 * @param   userId  用户id
 * @param   groupId 群id
 * @return
 */
const addGroupUserRelation = function (userId, groupId) {
  const data = [groupId, userId];
  const _sql = ' INSERT INTO  group_user_relation(group_id,user_id) VALUES(?,?); ';
  return query(_sql, data);
};
module.exports = {
  getGroupMsg,
  getGroupMember,
  getGroupInfo,
  saveGroupMsg,
  addGroupUserRelation
};
