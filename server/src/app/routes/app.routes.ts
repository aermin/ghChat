import { environment } from '@env';
import * as path from 'path';
import * as router from 'koa-router';
import * as statics from 'koa-static';

import { githubOAuthController, loginController, registerController } from '../controllers';


import * as fs from "fs";
import { apiRoutes } from './api.routes';

const LOAD_HTML = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile(path.join(environment.staticPath, '/index.html'), { 'encoding': 'utf8' }, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

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
  .get('/*', async (ctx, next) => {
    ctx.body = await LOAD_HTML();
    next();
  });
