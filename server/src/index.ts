import { createServer } from 'http';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
import * as statics from 'koa-static';
import * as cors from 'koa2-cors';
import { koa2FallbackApiMiddleware } from 'middlewares/koa2FallbackApi.middleware';
import { join } from 'path';

import socketHandle from './socket';
import { appRoutes } from 'routes/app.routes';

const app = new Koa();

app.use(compress());

const server = createServer(app.callback());
socketHandle(server);

app.use(cors());
app.use(bodyParser());

console.log('server node env', process.env.NODE_ENV);

app.use(koa2FallbackApiMiddleware());

// 配置静态资源
const staticPath = '../build';
app.use(statics(
  join(__dirname, staticPath)
));

app.use(appRoutes).use(allowedMethods());

server.listen(3000);

console.log('服务器已启动,端口3000');
