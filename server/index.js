const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const http = require('http');
const socketHandle = require('./socket');
const router = require('./routes/index');
const { query } = require('./utils/db');


const app = new Koa();

const server = http.createServer(app.callback());
socketHandle(server);
server.listen(3000);

app.use(cors());

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

global.query = query;

// app.listen(3000);
console.log('服务器已启动,端口3000');
