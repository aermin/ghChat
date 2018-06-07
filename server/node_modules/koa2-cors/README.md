# koa2-cors

## install

```bash
npm install --save koa2-cors
```

## Usage

```js
var koa = require('koa');
var cors = require('koa2-cors');

var app = koa();
app.use(cors());
```

## Options

### origin

Configures the **Access-Control-Allow-Origin** CORS header. expects a string. Can also be set to a function, which takes the `ctx` as the first parameter.

### exposeHeaders

Configures the **Access-Control-Expose-Headers** CORS header. Expects a comma-delimited array.

### maxAge

Configures the **Access-Control-Max-Age** CORS header. Expects a
Number.

### credentials

Configures the **Access-Control-Allow-Credentials** CORS header. Expects a Boolean.

### allowMethods

Configures the **Access-Control-Allow-Methods** CORS header. Expects a comma-delimited array , If not specified, default allowMethods is `['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']`.

### allowHeaders
Configures the **Access-Control-Allow-Headers** CORS header. Expects a comma-delimited array . If not specified, defaults to reflecting the headers specified in the request's **Access-Control-Request-Headers** header.

```js
var koa = require('koa');
var cors = require('koa2-cors');

var app = koa();
app.use(cors({
  origin: function(ctx) {
    if (ctx.url === '/test') {
      return false;
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
...
```

[More details about CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
