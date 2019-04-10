export const environment = {
  production: false,
  host: '127.0.0.1', // 数据库IP
  jwt_secret: 'chat-sec',
  dbConnection: {
    port: 3306, // 数据库端口
    database: 'ghchat', // 数据库名称
    user: 'root', // 数据库用户名
    password: '123456', // 数据库密码
  },
  baseApi: 'api/v1',
  secret: 'chat-sec' as any
};
