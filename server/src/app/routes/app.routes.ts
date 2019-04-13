import * as router from 'koa-router';

import { githubOAuthController, loginController, registerController } from '../controllers';
import { environment } from '@env';
import { koa2FallbackApiMiddleware } from '../middlewares/koa2FallbackApi.middleware';


export const appRoutes = new router()
  .prefix(`/${environment.baseApi}`)
  .get('/', async (ctx, next) => {
    await next();
    ctx.body = {
      message: 'server alive',
      time: new Date()
    };
    ctx.status = 200;
  })
  .use(koa2FallbackApiMiddleware())
  .post('/register', registerController) // 注册
  .post('/login', loginController) // 登录
  .post('/github_oauth', githubOAuthController);
