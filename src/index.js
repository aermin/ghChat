import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux'; // 让所有容器组件都可以访问store，而不必显示地传递它。只需要在渲染根组件时使用即可。
import { BrowserRouter as Router } from 'react-router-dom';
import store from './redux/store';
import App from './App';
import AxiosHandle from './utils/request';

if (
  // (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
  window.location.protocol === 'https:' &&
  navigator.serviceWorker
) {
  window.addEventListener('load', () => {
    const sw = '/service-worker.js';
    navigator.serviceWorker.register(sw);
  });
}

console.log(process.env.NODE_ENV);
function renderWithHotReload(RootElement) {
  ReactDom.render(
    <AppContainer>
      <Provider store={store}>
        <Router>
          <RootElement />
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );
}

/* 初始化 */
renderWithHotReload(App);

/* 热更新 */
if (module.hot) {
  module.hot.accept('./App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./App').default;
    renderWithHotReload(NextApp);
  });
}

AxiosHandle.axiosConfigInit();
