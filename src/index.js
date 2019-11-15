import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // 让所有容器组件都可以访问store，而不必显示地传递它。只需要在渲染根组件时使用即可。
import store from './redux/store';
import App from './App';
import getRouter from './router';
import AxiosHandle from './utils/request';


if (
  // (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
  window.location.protocol === 'https:'
    && navigator.serviceWorker
) {
  window.addEventListener('load', () => {
    const sw = '/service-worker.js';
    navigator.serviceWorker.register(sw);
  });
}

console.log(process.env.NODE_ENV);

ReactDom.render(
  (
    <BrowserRouter>

    <Provider store={store}>
        {getRouter()}
    </Provider>
    </BrowserRouter>

  ),
  document.getElementById('app')
);
// function renderWithHotReload(RootElement) {
//   ReactDom.render(
//     (
//       <Provider store={store}>
//         <RootElement />
//       </Provider>
//     ),
//     document.getElementById('app')
//   );
// }

/* 初始化 */
// renderWithHotReload(App);

// /* 热更新 */
// if (module.hot) {
//   module.hot.accept('./App', () => {
//     // eslint-disable-next-line global-require
//     const NextApp = require('./App').default;
//     renderWithHotReload(NextApp);
//   });
// }

AxiosHandle.axiosConfigInit();

export default hot(App);
