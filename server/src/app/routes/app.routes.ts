import { environment } from '@env';
import * as fs from 'fs';
import * as router from 'koa-router';
import * as statics from 'koa-static';
import * as path from 'path';

import { apiRoutes } from './api.routes';

export const appRoutes = new router()
  .get('/alive', (ctx, next) => {
    ctx.body = {
      message: 'server alive',
      time: new Date()
    };
    ctx.status = 200;
  })
  .use(
    path.join('/', environment.baseApi),
    apiRoutes.routes(),
    apiRoutes.allowedMethods()
  )
  .get('*.*', statics(environment.staticPath))
  .get('/*', (ctx, next) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(environment.staticPath, '/index.html'));
    next();
  });
