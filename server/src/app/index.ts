import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
import * as statics from 'koa-static';
import * as cors from 'koa2-cors';
import { join } from 'path';

import { ServicesContext } from './context';
import { koa2FallbackApiMiddleware } from './middlewares/koa2FallbackApi.middleware';
import { appRoutes } from './routes';
import { Server } from './server';
import { ChatService, GroupChatService, GroupService, UserService } from './services';

const app = Server.init();

// 配置静态资源
const staticPath = '../build';

;

app
  .use(compress())
  .use(cors())
  .use(bodyParser())
  .use(koa2FallbackApiMiddleware())
  .use(statics(
    join(__dirname, staticPath)
  ))
  // .use(morgan('dev', debugStream))
  // .use(morgan('combined', winstonStream))
  .use(appRoutes.routes())
  .use(appRoutes.allowedMethods());

ServicesContext.getInstance()
  .setuserService(new UserService())
  .setGroupService(new GroupService())
  .setChatService(new ChatService())
  .setgroupChatService(new GroupChatService());

Server.createConnection().then(async () => {
  console.log('DB connection  OK ');

});

Server.run(app, '3000');
// console.log('服务器已启动,端口3000');
