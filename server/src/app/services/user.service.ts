import { query } from '../utils/db';

export class UserService {
  // 模糊匹配用户
  fuzzyMatchUsers(link) {
    const _sql = `
    SELECT * FROM user_info WHERE name LIKE ?;
  `;
    return query(_sql, link);
  }

  // 注册用户
  insertData(value) {
    const _sql = 'insert into user_info(name,password) values(?,?);';
    return query(_sql, value);
  }

  // 添加github用户
  insertGithubData({ name, github_id, avatar, location, website, github, intro, company }) {
    const _sql =
      'insert into user_info(name, github_id, avatar, location, website, github, intro, company) values(?,?,?,?,?,?,?,?);';
    return query(_sql, [name, github_id, avatar, location, website, github, intro, company]);
  }

  // 通过github_id查找 github用户信息
  findGithubUser(githubId) {
    const _sql = 'SELECT * FROM user_info WHERE github_id = ? ;';
    return query(_sql, githubId);
  }

  // 更新 github 用户信息
  updateGithubUser({ name, avatar, location, website, github, intro, github_id, company }) {
    const _sql =
      ' UPDATE  user_info SET name = ?,avatar = ?,location = ?,website = ?,github = ?,intro= ?, company = ? WHERE github_id = ? ; ';
    return query(_sql, [name, avatar, location, website, github, intro, company, github_id]);
  }

  // 通过用户名查找非github用户信息 user_info
  findDataByName(name) {
    const _sql = 'SELECT * FROM user_info WHERE name = ? and github_id IS NULL;';
    return query(_sql, name);
  }

  // 通过用户id查找用户信息 user_info 包括用户名，性别，头像，最后登录时间，状态等，不包括密码
  getUserInfo(user_id) {
    const _sql =
      'SELECT id AS user_id, name, avatar, location, website, github, github_id, intro, company  FROM user_info   WHERE  user_info.id =? ';
    return query(_sql, [user_id]);
  }

  // 通过要查看的用户id 查询是否是本机用户的好友  如果是 返回user_id 和 remark 备注
  isFriend(user_id, from_user) {
    const _sql =
      'SELECT  * FROM user_user_relation  AS u WHERE  u.user_id = ? AND u.from_user = ? ';
    return query(_sql, [user_id, from_user]);
  }

  // 两边都互加为好友
  addFriendEachOther(user_id, from_user, time) {
    const _sql = 'INSERT INTO user_user_relation(user_id,from_user,time) VALUES (?,?,?), (?,?,?)';
    return query(_sql, [user_id, from_user, time, from_user, user_id, time]);
  }

  // 删除联系人
  deleteContact(user_id, from_user) {
    const _sql =
      'DELETE FROM  user_user_relation WHERE (user_id = ? AND from_user = ?) or (user_id = ? AND from_user = ?)';
    return query(_sql, [user_id, from_user, from_user, user_id]);
  }

  // 通过user_id查找首页群列表
  // TODO： 优化sql语句
  getGroupList(user_id) {
    const _sql = `SELECT r.to_group_id ,i.name , i.create_time,
      (SELECT g.message  FROM group_msg AS g  WHERE g.to_group_id = r.to_group_id  ORDER BY TIME DESC   LIMIT 1 )  AS message ,
      (SELECT g.time  FROM group_msg AS g  WHERE g.to_group_id = r.to_group_id  ORDER BY TIME DESC   LIMIT 1 )  AS time,
      (SELECT g.attachments FROM group_msg AS g  WHERE g.to_group_id = r.to_group_id  ORDER BY TIME DESC   LIMIT 1 )  AS attachments
      FROM  group_user_relation AS r inner join group_info AS i on r.to_group_id = i.to_group_id WHERE r.user_id = ? ;`;
    return query(_sql, user_id);
  }

  // 通过user_id查找首页私聊列表
  // TODO： 优化sql语句
  getPrivateList(user_id) {
    const _sql = ` SELECT r.from_user as user_id, i.name, i.avatar, i.github_id, r.time as be_friend_time,
      (SELECT p.message FROM private_msg AS p WHERE (p.to_user = r.from_user and p.from_user = r.user_id) or (p.from_user = r.from_user and p.to_user = r.user_id) ORDER BY p.time DESC   LIMIT 1 )  AS message ,
      (SELECT p.time FROM private_msg AS p WHERE (p.to_user = r.from_user and p.from_user = r.user_id) or (p.from_user = r.from_user and p.to_user = r.user_id) ORDER BY p.time DESC   LIMIT 1 )  AS time,
      (SELECT p.attachments FROM private_msg AS p WHERE (p.to_user = r.from_user and p.from_user = r.user_id) or (p.from_user = r.from_user and p.to_user = r.user_id) ORDER BY p.time DESC   LIMIT 1 )  AS attachments
      FROM  user_user_relation AS r inner join user_info AS i on r.from_user  = i.id WHERE r.user_id = ? ;`;
    return query(_sql, user_id);
  }

  saveUserSocketId(user_id, socketId) {
    const data = [socketId, user_id];
    const _sql = ' UPDATE  user_info SET socketid = ? WHERE id= ? limit 1 ; ';
    return query(_sql, data);
  }

  getUserSocketId(toUserId) {
    const _sql = ' SELECT socketid FROM user_info WHERE id=? limit 1 ;';
    return query(_sql, [toUserId]);
  }

  // 加为好友 单方面 (之后可能会加上开启好友验证的功能)
  // const addAsFriend = (user_id, from_user, time) {
  //   const _sql = 'INSERT INTO user_user_relation(user_id,from_user,time) VALUES (?,?,?)';
  //   return query(_sql, [user_id, from_user, time]);
  // };

  // 屏蔽好友
  // const shieldFriend = (status, user_id, from_user) {
  //   const _sql = 'UPDATE  user_user_relation  SET shield = ?  WHERE  user_id = ? AND from_user = ? ';
  //   return query(_sql, [status, user_id, from_user]);
  // };

  // // 修改备注
  // const editorRemark = (remark, user_id, from_user) {
  //   const _sql = 'UPDATE  user_user_relation  SET remark = ?  WHERE  user_id = ? AND from_user = ? ';
  //   return query(_sql, [remark, user_id, from_user]);
  // };

  // 通过用户名查找用户信息 user_info 不包括密码
  // const findUIByName = (name) {
  //   const _sql = 'SELECT id ,name ,sex,avatar,location,github FROM user_info WHERE name = ? ';
  //   return query(_sql, name);
  // };

  // 修改我的信息
  // const editorInfo = (data) {
  //   const _sql = ' UPDATE  user_info SET github = ?,website = ?,sex = ?,location = ? WHERE id = ? ; ';
  //   return query(_sql, data);
  // };

  // 通过用户id查找用户信息 user_info 包括密码
  // const findDataByUserid = (user_id) {
  //   const _sql = 'SELECT * FROM user_info WHERE id= ? ';
  //   return query(_sql, [userid]);
  // };
}
