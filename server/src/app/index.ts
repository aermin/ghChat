import { createServer } from 'http';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
import * as statics from 'koa-static';
import * as cors from 'koa2-cors';
import { koa2FallbackApiMiddleware } from './middlewares/koa2FallbackApi.middleware';
import { join } from 'path';

import { appRoutes } from './routes';
import { ServicesContext } from './context';
import { UserService, ChatService, GroupChatService, GroupService } from './services';
import { appSocket } from './socket/app.socket';

const app = new Koa();
// 配置静态资源
const staticPath = '../build';

app.use(compress());

const server = createServer(app.callback());
appSocket(server);

console.log('server node env', process.env.NODE_ENV);

app
  .use(cors())
  .use(bodyParser())
  .use(koa2FallbackApiMiddleware())
  .use(statics(
    join(__dirname, staticPath)
  ))
  .use(appRoutes.routes())
  .use(appRoutes.allowedMethods());

ServicesContext.getInstance()
  .setuserService(new UserService())
  .setGroupService(new GroupService())
  .setChatService(new ChatService())
  .setgroupChatService(new GroupChatService());


server.listen(3000);

console.log('服务器已启动,端口3000');
