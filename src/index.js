import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux'; // 让所有容器组件都可以访问store，而不必显示地传递它。只需要在渲染根组件时使用即可。
import { BrowserRouter as Router } from 'react-router-dom';
import store from './redux/store';
import { getHomePageListAction, getAllChatContentAction } from './redux/actions/initAction';
import App from './App';
// import axios from 'axios'
import AxiosHandle from './utils/request';


function renderWithHotReload(RootElement) {
  ReactDom.render(
    <AppContainer>
      <Provider store={store}>
        <Router>
          <RootElement />
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  );
}

/* 初始化 */
renderWithHotReload(App);

/* 热更新 */
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    renderWithHotReload(NextApp);
  });
}

AxiosHandle.axiosConfigInit();

// init: fetch HomePageList and AllChatContent;
getHomePageListAction().then((res) => {
  store.dispatch(res);
  getAllChatContentAction(res.data).then((res) => {
    store.dispatch(res);
  });
});
