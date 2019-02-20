const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const http = require('http');
const socketHandle = require('./socket');
const router = require('./routes/index');
const { query } = require('./utils/db');
const static = require('koa-static'); //静态资源服务插件
const path = require('path'); //路径管理
const url = require('url');

const app = new Koa();

const server = http.createServer(app.callback());
socketHandle(server);

app.use(cors());

app.use(bodyParser());

console.log('server node env', process.env.NODE_ENV);
// 配置静态资源
const staticPath = '../build/';


app.use(router.routes()).use(router.allowedMethods());

app.use(koa2FallbackApiMiddleware());

// router.get('*', async function(ctx, next) {
//   var html = fs.readFileSync(path.resolve('../build/index.html'));
// 	console.log('html233', html);
//   ctx.type = 'html';
//   ctx.body = html;
// })

function koa2FallbackApiMiddleware (options) {
  options = options || {}
  // const logger = getLogger(options)

  return function (ctx, next) {
    const headers = ctx.headers
    const reqUrl = ctx.url
    const method = ctx.method
		logger = () =>{

		}
    if (method !== 'GET') {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the method is not GET.'
      )
      return next()
    }
    if (!headers || typeof headers.accept !== 'string') {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the client did not send an HTTP accept header.'
      )
      return next()
    }
    if (headers.accept.indexOf('application/json') === 0) {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the client prefers JSON.'
      )
      return next()
    }

    // if (!acceptsHtml(headers.accept)) {
    //   logger(
    //     'Not rewriting',
    //     method,
    //     reqUrl,
    //     'because the client does not accept HTML.'
    //   )
    //   return next()
    // }

    const parsedUrl = url.parse(reqUrl)
    let rewriteTarget = null

    options.rewrites = options.rewrites || []

    for (let i = 0; i < options.rewrites.length; i++) {
      const rewrite = options.rewrites[i]
      const match = parsedUrl.pathname.match(rewrite.from)
      if (match !== null) {
        rewriteTarget = evaluateRewriteRule(parsedUrl, match, rewrite.to)
        logger('Rewriting', ctx.method, ctx.url, 'to', rewriteTarget)
        ctx.url = rewriteTarget
        return next()
      }
    }

    if (parsedUrl.pathname.indexOf('.') !== -1) {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the path includes a dot (.) character.'
      )
      return next()
    }

    rewriteTarget = options.index || '/index.html'

    logger('Rewriting', method, reqUrl, 'to', rewriteTarget)

    ctx.url = rewriteTarget

    return next()
  }
}

global.query = query;

app.use(static(
	path.join(__dirname, staticPath)
))
server.listen(3000);


// app.listen(3000);
console.log('服务器已启动,端口3000');
