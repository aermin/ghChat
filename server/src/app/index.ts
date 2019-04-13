import { environment } from '@env';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
import * as statics from 'koa-static';
import * as cors from 'koa2-cors';
import { join } from 'path';

import { ServicesContext } from './context';
import { appRoutes } from './routes';
import { Server } from './server';
import { ChatService, GroupChatService, GroupService, UserService } from './services';

// 配置静态资源
const staticPath = '../build';

Server
  .init((app) => {
    app.use(compress())
      .use(cors())
      .use(bodyParser())
      .use(statics(
        join(__dirname, staticPath)
      ))
      .use(appRoutes.routes())
      .use(appRoutes.allowedMethods())
  })
  .createServer()
  .createConnection()
  .then(() => {
    ServicesContext.getInstance()
      .setuserService(new UserService())
      .setGroupService(new GroupService())
      .setChatService(new ChatService())
      .setgroupChatService(new GroupChatService());

    Server.run(environment.port);
  });

