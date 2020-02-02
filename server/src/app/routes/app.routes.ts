import configs from '@configs';
import * as fs from 'fs';
import * as Router from 'koa-router';
import * as statics from 'koa-static';
import * as path from 'path';

import { apiRoutes } from './api.routes';

export const appRoutes = new Router()
  .get('/alive', (ctx, next) => {
    ctx.body = {
      message: 'server alive',
      time: new Date(),
    };
    ctx.status = 200;
  })
  .use('/api/v1', apiRoutes.routes(), apiRoutes.allowedMethods())
  .get('*.*', statics(configs.staticPath))
  .get('/*', (ctx, next) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(configs.staticPath, '/index.html'));
    next();
  });
