import React from "react";

import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";

import Bundle from "./Bundle";
import Register from "bundle-loader?lazy&name=Register!../pages/Register";
import Login from "bundle-loader?lazy&name=Login!../pages/Login";
import ContentLeft from "bundle-loader?lazy&name=ContentLeft!../pages/ContentLeft";
import ContentRight from "bundle-loader?lazy&name=ContentRight!../pages/ContentRight";

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
    content_left:createComponent(ContentLeft),
    content_right:  createComponent(ContentRight)
  },
  { path: '/robot',
    exact: true,
    content_left:createComponent(ContentLeft),
    content_right:  createComponent(ContentRight)
  }
]
console.log('router-props', window.location.pathname);
const getRouter = () => (
  <Router>
      <div>
              <Route  path="/register" exact= {true} component={createComponent(Register)} />
              <Route  path="/login" exact= {true} component={createComponent(Login)} />
              <div className = 'layout-wrapper'>
                        {routes.map((route, index) => (
                          <Route
                              key={index}
                              path={route.path}
                              exact={route.exact}
                              component={route.content_left}
                            />
                        ))}
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
  </Router>
);

export default getRouter;
