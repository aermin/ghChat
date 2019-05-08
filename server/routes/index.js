const path = require('path');
const router = require('koa-router')();
const baseApi = require('../config').baseApi;
const register = require('../controllers/register');
const login = require('../controllers/login');
const githubOAuth = require('../controllers/githubOAuth');

const apiRoutes = router
  .post('/register', register) // 注册
  .post('/login', login) // 登录
  .post('/github_oauth', githubOAuth);


router.use(
  path.join('/', baseApi),
  apiRoutes.routes(),
  apiRoutes.allowedMethods()
);

module.exports = router;
