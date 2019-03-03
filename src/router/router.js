import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import RegisterPage from 'bundle-loader?lazy&name=RegisterPage!../containers/RegisterPage';
import LogInPage from 'bundle-loader?lazy&name=LogInPage!../containers/LogInPage';
import ContentLeft from 'bundle-loader?lazy&name=ContentLeft!../containers/ContentLeft';
import ContentRight from 'bundle-loader?lazy&name=ContentRight!../containers/ContentRight';
import Bundle from './Bundle';

const Loading = function () {
  return <div>Loading...</div>;
};

const createComponent = component => (props) => {
  const { pathname } = props.location;
  if (pathname !== '/login' && pathname !== '/register' && !localStorage.getItem('userInfo')) {
    props.history.push('/login');
  }
  return (
    <Bundle load={component}>
      {Component => (Component ? <Component {...props} /> : <Loading />)}
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
