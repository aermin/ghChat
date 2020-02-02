import { query } from '../utils/db';

export class GroupChatService {
  /**
   * 获取群消息
   * @param  群id
   * @return  message 群消息
   * @return  time  时间
   * @return  from_user  发送人id
   *  @return  avatar  发送人头像
   */
  getGroupMsg(groupId, start, count) {
    const _sql =
      'SELECT * FROM (SELECT g.message,g.attachments,g.time,g.from_user,g.to_group_id, i.avatar ,i.name, i.github_id FROM group_msg  As g inner join user_info AS i ON g.from_user = i.id  WHERE to_group_id = ? order by time desc limit ?,?) as n order by n.time; ';
    return query(_sql, [groupId, start, count]);
  }

  /**
   * 获取群成员
   * @param   群id
   * @return  group_member_id  群成员id
   */
  getGroupMember(groupId) {
    const _sql =
      'SELECT g.user_id, u.socketid, u.name, u.avatar, u.github_id, u.github, u.intro, u.company, u.location, u.website FROM group_user_relation AS g inner join user_info AS u ON g.user_id = u.id WHERE to_group_id = ?';
    return query(_sql, groupId);
  }

  /**
   * 获取群资料
   * @param   arr 包括 groupId  groupName 至少一个
   * @return
   */
  getGroupInfo(arr) {
    const _sql =
      'SELECT to_group_id, name, group_notice, creator_id, create_time FROM group_info  WHERE to_group_id = ? OR name = ? ;';
    return query(_sql, arr);
  }

  /**
   * 存聊天记录
   * @param   user_id  用户id
   * @param   groupId 群id
   * @param   message  消息
   * @param   name 用户名
   * @param   time  时间
   * @return
   */

  saveGroupMsg({ from_user, to_group_id, message, time, attachments }) {
    const data = [from_user, to_group_id, message, time, attachments];
    const _sql =
      ' INSERT INTO group_msg(from_user,to_group_id,message ,time, attachments) VALUES(?,?,?,?,?); ';
    return query(_sql, data);
  }

  /**
   * 群添加成员并返回群成员
   * @param   user_id  用户id
   * @param   groupId 群id
   * @return
   */
  addGroupUserRelation(user_id, groupId) {
    const data = [groupId, user_id];
    const _sql = ' INSERT INTO  group_user_relation(to_group_id,user_id) VALUES(?,?); ';
    return query(_sql, data);
  }

  getUnreadCount({ sortTime, to_group_id }) {
    const data = [sortTime, to_group_id];
    const _sql =
      'SELECT count(time) as unread FROM group_msg as p where p.time > ? and p.to_group_id = ?;';
    return query(_sql, data);
  }
}
