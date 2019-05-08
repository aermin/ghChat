const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const compress = require('koa-compress');
const http = require('http');
const statics = require('koa-static');
const path = require('path');
const socketHandle = require('./socket');
const router = require('./routes/index');
const { query } = require('./utils/db');

const app = new Koa();

app.use(compress());

const server = http.createServer(app.callback());
socketHandle(server);

app.use(cors());

app.use(bodyParser());

console.log('server node env', process.env.NODE_ENV);

app.use(router.routes()).use(router.allowedMethods());

global.query = query;

// 配置静态资源
const staticPath = '../build';
app.use(statics(
  path.join(__dirname, staticPath)
));

server.listen(3000);

console.log('服务器已启动,端口3000');
