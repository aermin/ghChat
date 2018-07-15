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
    exact: true
  },
  { path: '/robot',
    exact: true
  },
  { path: '/group_chat/:group_id',
    exact: true
  },
  { path: '/private_chat/:user_id',
    exact: true
  },  
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
                              component={createComponent(ContentLeft)}
                            />
                        ))}
                        {routes.map((route, index) => (
                          <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            component={createComponent(ContentRight)}
                          />
                        ))}
              </div> 
      </div>
  </Router>
);

export default getRouter;
