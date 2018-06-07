const { query } = require("../utils/db");


/**
 * 获取私聊相关内容
 * @param  to_user 私聊对象的id
 * @param  from_user 私聊者自己的id
 * @return  from_user  此条信息的发送者
 *          to_user 此条信息的接收者
 *          message 私聊信息
 *          time 时间
 *          avator 发送者的头像
//  *          sex 发送者的性别 
//  *          place 发送者居住地
 *         status 发送者的是否在线 
 */
let getPrivateDetail = (from_user,to_user)=>{
    const data = [from_user,to_user,to_user,from_user]
    const _sql =  
    'select p.from_user,p.to_user, p.message ,p.time ,i.avator , i.name ,i.status  from private__msg as p  inner join user_info as i  on p.from_user = i.id  where  (p.from_user = ? AND p.to_user   = ? )  or (p.from_user = ? AND p.to_user   = ? )  order by time '
    return query(_sql, data);
}

/**
 * 存聊天记录
 * @param   from_user  发送者id
 * @param   to_user  接收者id
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */

let savePrivateMsg = function(from_user, to_user, message, name, time) {
    const data = [from_user, to_user, `${name} : ${message}`, time];
    let _sql =
      " INSERT INTO private__msg(from_user,to_user,message ,time)  VALUES(?,?,?,?); ";
    return query(_sql, data);
  };

  module.exports = {
    getPrivateDetail,
    savePrivateMsg
  };