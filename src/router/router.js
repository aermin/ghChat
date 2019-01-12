import React from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import RegisterPage from 'bundle-loader?lazy&name=RegisterPage!../containers/RegisterPage';
import LogInPage from 'bundle-loader?lazy&name=LogInPage!../containers/LogInPage';
import ContentLeft from 'bundle-loader?lazy&name=ContentLeft!../containers/ContentLeft';
import ContentRight from 'bundle-loader?lazy&name=ContentRight!../containers/ContentRight';
import Bundle from './Bundle';

const Loading = function () {
  return <div>Loading...</div>;
};

const createComponent = component => props => (
  <Bundle load={component}>
    {Component => (Component ? <Component {...props} /> : <Loading />)}
  </Bundle>
);

const routes = [
  {
    path: '/',
    exact: true
  },
  {
    path: '/index'
  },
  {
    path: '/robot'
  },
  {
    path: '/group_chat/:to_group_id',
  },
  {
    path: '/private_chat/:userId',
  },
];

export default function getRouter() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  console.log('getRouter~~');
  const { pathname } = window.location;
  if (userInfo && pathname !== '/login' && pathname !== '/register') {
    window.socket = io('http://localhost:3000');
    console.log('initMessage && saveSocketIdByUserId');
    window.socket.emit('saveSocketIdByUserId', userInfo.userId);
    window.socket.emit('initMessage', userInfo.userId);
  }

  return (
    <Router>
      <div className="layout-wrapper">
        <Route path="/register" component={createComponent(RegisterPage)} />
        <Route path="/login" component={createComponent(LogInPage)} />
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={createComponent(ContentLeft)} />
        ))}
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={createComponent(ContentRight)} />
        ))}
      </div>
    </Router>
  );
}
