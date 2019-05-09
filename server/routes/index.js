const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const statics = require('koa-static');
const { baseApi, staticDirPath } = require('../config');
const register = require('../controllers/register');
const login = require('../controllers/login');
const githubOAuth = require('../controllers/githubOAuth');

const apiRoutes = router
  .post('/register', register) // 注册
  .post('/login', login) // 登录
  .post('/github_oauth', githubOAuth);


router
  .use(
    path.join('/', baseApi),
    apiRoutes.routes(),
    apiRoutes.allowedMethods()
  )
  .get('*.*', statics(staticDirPath))
  .get('/*', (ctx, next) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(staticDirPath, '/index.html'));
    next();
  });

module.exports = router;
