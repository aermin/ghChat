import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import RegisterPage from 'bundle-loader?lazy&name=RegisterPage!../containers/RegisterPage';
import LogInPage from 'bundle-loader?lazy&name=LogInPage!../containers/LogInPage';
import MainView from 'bundle-loader?lazy&name=MainView!../containers/MainView';
import RightView from 'bundle-loader?lazy&name=RightView!../containers/RightView';
import Bundle from './Bundle';

const createComponent = component => (props) => {
  const { pathname } = props.location;
  if (pathname !== '/login' && pathname !== '/register' && !localStorage.getItem('userInfo')) {
    props.history.push('/login');
  }
  return (
    <Bundle load={component}>
      {Component => (Component ? <Component {...props} /> : null)}
    </Bundle>
  );
};
const routes = [
  {
    path: '/',
    exact: true
  },
  {
    path: '/robot_chat'
  },
  {
    path: '/setting'
  },
  {
    path: '/group_chat/:to_group_id',
  },
  {
    path: '/private_chat/:user_id',
  },
];

export default function getRouter() {
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
            component={createComponent(MainView)} />
        ))}
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={createComponent(RightView)} />
        ))}
      </div>
    </Router>
  );
}
