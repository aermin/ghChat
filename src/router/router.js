import React from "react";

import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Bundle from "./Bundle";

import LayoutLeft from "bundle-loader?lazy&name=LayoutLeft!../pages/LayoutLeft";
import Robot from "bundle-loader?lazy&name=Robot!../pages/Robot";
import Register from "bundle-loader?lazy&name=Register!../pages/Register";
import Login from "bundle-loader?lazy&name=Register!../pages/Login";
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
    layout_left: createComponent(LayoutLeft),
    layout_right:  createComponent(Robot)
  }
  // ,
  // { path: '/bubblegum',
  //   sidebar: () => <div>bubblegum!</div>,
  //   main: () => <h2>Bubblegum</h2>
  // },
  // { path: '/shoelaces',
  //   sidebar: () => <div>shoelaces!</div>,
  //   main: () => <h2>Shoelaces</h2>
  // }
]

const getRouter = () => (
  <Router>
      {/* <Switch> */}
      <div className = 'layout-wrapper'>
        {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.layout_left}
            />
        ))}
      <div className= {'layout-right-mobile'}>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.layout_right}
            />
          ))}
        </div>
      </div>
        {/* <Route exact path="/" component={createComponent(LayoutLeft)}/>
        <Route exact path="/group_chat" component={createComponent(GroupChat)}/>
        <Route path="/register" component={createComponent(Register)} />
        <Route path="/login" component={createComponent(Login)} /> */}
      {/* </Switch> */}
  </Router>
);

export default getRouter;
