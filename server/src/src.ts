import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import compress from 'koa-compress';
import { createServer } from 'http';
import statics from 'koa-static'; // 静态资源服务插件
import { join } from 'path'; // 路径管理
import socketHandle from './socket';
import { routes, allowedMethods } from './routes/index';
import { query } from './utils/db';
import koa2FallbackApiMiddleware from './middlewares/koa2FallbackApiMiddleware';

const app = new Koa();

app.use(compress());

const server = createServer(app.callback());
socketHandle(server);

app.use(cors());

app.use(bodyParser());

console.log('server node env', process.env.NODE_ENV);

app.use(routes()).use(allowedMethods());

app.use(koa2FallbackApiMiddleware());

global.query = query;

// 配置静态资源
const staticPath = '../build';
app.use(statics(
  join(__dirname, staticPath)
));

server.listen(3000);

console.log('服务器已启动,端口3000');
