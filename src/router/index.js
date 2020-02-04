import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';

const FUNCTION_ROUTERS = [
  '/',
  '/robot_chat',
  '/group_chat/:to_group_id',
  '/private_chat/:user_id',
  '/setting',
];
const AUTH_ROUTERS = ['/login', '/register'];

function MainView(props) {
  const { pathname } = props.location;
  if (AUTH_ROUTERS.indexOf(pathname) < 0 && !localStorage.getItem('userInfo')) {
    sessionStorage.setItem('originalLink', window.location.href);
    props.history.push('/login');
  }

  let MainViewClassName;
  if (pathname === '/' || pathname === '/setting') {
    MainViewClassName = 'layout-left';
  } else {
    MainViewClassName = 'layout-left-mobile';
  }

  return (
    <div className={MainViewClassName}>
      <Route component={loadable(() => import('../containers/Tabs'))} />
      <Route
        path={['/', '/robot_chat', '/group_chat/:to_group_id', '/private_chat/:user_id']}
        exact
        component={loadable(() => import('../containers/HomePageList'))}
      />
      <Route
        path="/setting"
        exact
        component={loadable(() => import('../containers/SettingPage'))}
      />
    </div>
  );
}

function RightView(props) {
  const { pathname } = props.location;
  let RightViewClassName;

  if (pathname === '/' || pathname === '/setting') {
    RightViewClassName = 'layout-right-mobile';
  } else {
    RightViewClassName = 'layout-right';
  }

  return (
    <div className={RightViewClassName}>
      <Route path="/robot_chat" component={loadable(() => import('../containers/RobotPage'))} />
      <Route
        path="/group_chat/:to_group_id"
        component={loadable(() => import('../containers/GroupChatPage'))}
      />
      <Route
        path="/private_chat/:user_id"
        component={loadable(() => import('../containers/PrivateChatPage'))}
      />
      {['/', '/setting'].map((path, index) => (
        <Route
          path={path}
          exact
          component={loadable(() => import('../containers/WelcomePage'))}
          key={index}
        />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="layout-wrapper">
        <Switch>
          <Route
            path="/register"
            exact
            component={loadable(() => import('../containers/RegisterPage'))}
          />
          <Route
            path="/login"
            exact
            component={loadable(() => import('../containers/LogInPage'))}
          />
          <Route exact path={FUNCTION_ROUTERS}>
            <Route path={FUNCTION_ROUTERS} exact component={MainView} />
            <Route path={FUNCTION_ROUTERS} exact component={RightView} />
          </Route>
          <Route component={loadable(() => import('../components/NotFound'))} />
        </Switch>
      </div>
    </Router>
  );
}
