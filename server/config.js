const secrets = require('./secret');

this._isProduction = process.env.NODE_ENV === 'production';

const password = this._isProduction ? secrets.dbPassword : '123456';

const db = {
  host: '127.0.0.1', // 数据库IP
  port: 3306, // 数据库端口
  database: 'airchat', // 数据库名称
  user: 'root', // 数据库用户名
  password, // 数据库密码
};
const baseApi = 'api/v1';

const secret = this._isProduction ? (secrets && secrets.secretValue) : 'chat-sec';

module.exports = {
  db,
  baseApi,
  secret
};
