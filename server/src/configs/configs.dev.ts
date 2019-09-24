import commonConfigs from './configs.common';

export default {
  production: false,
  ...commonConfigs,
  port: '3000',
  dbConnection: {
    host: '127.0.0.1', // 数据库IP
    port: 3306, // 数据库端口
    database: 'ghchat', // 数据库名称
    user: 'root', // 数据库用户名
    password: '123456', // 数据库密码
  },
  client_secret: '',
  jwt_secret: 'chat-sec',
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: ''
  },
};
