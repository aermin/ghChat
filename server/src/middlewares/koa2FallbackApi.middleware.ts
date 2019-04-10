import * as url from 'url';

export function koa2FallbackApiMiddleware(options?) {
  options = options || {};
  const logger = (a, b, c, d) => {
    console.log(a, b, c, d);
  };

  return (ctx, next) => {
    const headers = ctx.headers;
    const reqUrl = ctx.url;
    const method = ctx.method;
    if (method !== 'GET') {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the method is not GET.'
      );
      return next();
    }
    if (!headers || typeof headers.accept !== 'string') {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the client did not send an HTTP accept header.'
      );
      return next();
    }
    if (headers.accept.indexOf('application/json') === 0) {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the client prefers JSON.'
      );
      return next();
    }
    const parsedUrl = url.parse(reqUrl);
    let rewriteTarget = null;

    if (parsedUrl.pathname.indexOf('.') !== -1) {
      logger(
        'Not rewriting',
        method,
        reqUrl,
        'because the path includes a dot (.) character.'
      );
      return next();
    }

    rewriteTarget = options.index || '/index.html';

    logger('Rewriting', method, reqUrl, 'to');

    ctx.url = rewriteTarget;

    return next();
  };
}
