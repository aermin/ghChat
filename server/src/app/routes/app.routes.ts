import * as router from 'koa-router';

import { githubOAuthController, loginController, registerController } from '../controllers';
import { environment } from '@env';


export const appRoutes = new router()
  .prefix(`/${environment.baseApi}`)
  .post('/register', registerController) // 注册
  .post('/login', loginController) // 登录
  .post('/github_oauth', githubOAuthController);
