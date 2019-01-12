import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux'; // 让所有容器组件都可以访问store，而不必显示地传递它。只需要在渲染根组件时使用即可。
import { BrowserRouter as Router } from 'react-router-dom';
import store from './redux/store';
import { setHomePageListAction, setAllChatContentAction } from './redux/actions/initAction';
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
    // eslint-disable-next-line global-require
    const NextApp = require('./App').default;
    renderWithHotReload(NextApp);
  });
}

AxiosHandle.axiosConfigInit();

// init: fetch HomePageList and AllChatContent;
window.socket.on('getAllMessage', (data) => {
  console.log('getAllMessage', data);
  const privateChat = new Map(data.privateChat);
  const groupChat = new Map(data.groupChat);
  console.log('privateChat, groupChat', privateChat, groupChat);
  store.dispatch(setHomePageListAction(data.homePageList));
  store.dispatch(setAllChatContentAction({ privateChat, groupChat }));
});
