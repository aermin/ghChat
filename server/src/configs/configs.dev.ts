import commonConfigs from './configs.common';

export default {
  production: false,
  ...commonConfigs,
  port: '3000',
  dbConnection: {
    host: '120.77.247.212', // 数据库IP
    port: 3306, // 数据库端口
    database: 'ghchat', // 数据库名称
    user: 'ghchat', // 数据库用户名
    password: 'Ghchat@123', // 数据库密码
  },
  client_secret: '',
  jwt_secret: 'chat-sec',
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
  },
  robot_key: '', // 机器人聊天用到的key => 请自己申请http://www.tuling123.com/
};
