import React from 'react';
import ReactDom from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {Provider} from 'react-redux'; //让所有容器组件都可以访问store，而不必显示地传递它。只需要在渲染根组件时使用即可。
import store from './redux/store';

import getRouter from './router/router';

/*初始化*/
renderWithHotReload(getRouter());

/*热更新*/
if (module.hot) {
    module.hot.accept('./router/router', () => {
        const getRouter = require('./router/router').default;
        renderWithHotReload(getRouter());
    });
}

function renderWithHotReload(RootElement) {
    ReactDom.render(
        <AppContainer>
            <Provider store={store}> 
                {RootElement}
            </Provider>
        </AppContainer>,
        document.getElementById('app')
    )
}