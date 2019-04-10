
const { query } = require('../utils/db');

const saveUserSocketId = (user_id, socketId) => {
  const data = [socketId, user_id];
  const _sql = ' UPDATE  user_info SET socketid = ? WHERE id= ? limit 1 ; ';
  return query(_sql, data);
};


const getUserSocketId = (toUserId) => {
  const _sql = ' SELECT socketid FROM user_info WHERE id=? limit 1 ;';
  return query(_sql, [toUserId]);
};

module.exports = {
  saveUserSocketId,
  getUserSocketId
};
