import { environment } from '@env';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
import * as cors from 'koa2-cors';

import { ServicesContext } from './context';
import { appRoutes } from './routes';
import { Server } from './server';
import { ChatService, GroupChatService, GroupService, UserService } from './services';

export const App = Server
  .init((app) => {
    app.use(compress())
      .use(cors())
      .use(bodyParser())
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
