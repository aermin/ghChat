import { githubOAuthController, loginController, registerController } from 'controllers';
import * as router from 'koa-router';

const baseApi = require('../config').baseApi;

export const appRoutes = new router()
  .prefix(`/${baseApi}`)
  .post('/register', registerController) // 注册
  .post('/login', loginController) // 登录
  .post('/github_oauth', githubOAuthController);
