import * as Router from 'koa-router';

import { githubOAuthController, loginController, registerController } from '../controllers';

export const apiRoutes = new Router()
  .post('/register', registerController) // 注册
  .post('/login', loginController) // 登录
  .post('/github_oauth', githubOAuthController);
