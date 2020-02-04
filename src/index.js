import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux'; // 让所有容器组件都可以访问store，而不必显示地传递它。只需要在渲染根组件时使用即可。
import store from './redux/store';
import App from './router';
import AxiosHandle from './utils/request';
import './index.scss';

if (window.location.protocol === 'https:' && navigator.serviceWorker) {
  window.addEventListener('load', () => {
    const sw = '/service-worker.js';
    navigator.serviceWorker.register(sw);
  });
}
console.log(process.env.NODE_ENV);

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);

AxiosHandle.axiosConfigInit();
