import * as router from 'koa-router';

import { githubOAuthController, loginController, registerController } from '../controllers';

export const apiRoutes = new router()
  .post('/register', registerController) // 注册
  .post('/login', loginController) // 登录
  .post('/github_oauth', githubOAuthController);
