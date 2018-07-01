import React from "react";

import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";

import Bundle from "./Bundle";
import './style.scss';
import SideBar from "bundle-loader?lazy&name=SideBar!../pages/SideBar";
import Robot from "bundle-loader?lazy&name=Robot!../pages/Robot";
import Welcome from "bundle-loader?lazy&name=Welcome!../pages/Welcome";
import Register from "bundle-loader?lazy&name=Register!../pages/Register";
import Login from "bundle-loader?lazy&name=Login!../pages/Login";
import HomePageList from "bundle-loader?lazy&name=HomePageList!../pages/HomePageList";
import GroupChat from "bundle-loader?lazy&name=GroupChat!../pages/GroupChat";

const Loading = function() {
  return <div>Loading...</div>;
};

const createComponent = component => props => (
  <Bundle load={component}>
    {Component => (Component ? <Component {...props} /> : <Loading />)}
  </Bundle>
);

const routes = [
  { path: '/',
    exact: true,
    side_bar:   createComponent(SideBar),
    content_left:createComponent(HomePageList),
    content_right:  createComponent(Welcome)
  },
  { path: '/robot',
    exact: true,
    side_bar:   createComponent(SideBar),
    content_left:createComponent(HomePageList),
    content_right:  createComponent(Robot)
}
]
console.log('router-props', window.location.pathname);
const getRouter = () => (
  <Router>
      <div>
              <Route  path="/register" exact= {true} component={createComponent(Register)} />
              <Route  path="/login" exact= {true} component={createComponent(Login)} />
              <div className = 'layout-wrapper'>
                    <div className = {window.location.pathname === '/robot' ? 'layout-left-mobile' : 'layout-left'} >
                        {routes.map((route, index) => (
                          <Route
                              key={index}
                              path={route.path}
                              exact={route.exact}
                              component={route.side_bar}
                            />
                        ))}
                        {routes.map((route, index) => (
                            <Route
                              key={index}
                              path={route.path}
                              exact={route.exact}
                              component={route.content_left}
                            />
                        ))} 
                    </div>    
                    <div className= {window.location.pathname === '/robot' ? 'layout-right' : 'layout-right-mobile'}>
                        {routes.map((route, index) => (
                          <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            component={route.content_right}
                          />
                        ))}
                    </div>
              </div> 
      </div>
  </Router>
);

export default getRouter;
