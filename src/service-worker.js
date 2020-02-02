// 用workbox-sw替代之前的实现方案，感谢碎碎酱@yinxin630的建议和方案

importScripts('https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js');

if (workbox) {
  workbox.setConfig({ modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.3.0/' });

  workbox.precaching.precache(['/', '/index.html']);

  workbox.routing.registerRoute(
    new RegExp('^https?://im.aermin.top/?$'),
    workbox.strategies.networkFirst(),
  );

  workbox.routing.registerRoute(new RegExp('.*.html'), workbox.strategies.networkFirst());

  workbox.routing.registerRoute(
    new RegExp('.*.(?:js|css)'),
    workbox.strategies.staleWhileRevalidate(),
  );

  workbox.routing.registerRoute(
    new RegExp('https://cdn.aremin.top/'),
    workbox.strategies.cacheFirst(),
  );
}
