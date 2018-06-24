import React from "react";

import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Bundle from "./Bundle";

// import Home from 'bundle-loader?lazy&name=home!../pages/Home/Home';
// import Page1 from 'bundle-loader?lazy&name=page1!../pages/Page1/Page1';
// import Counter from 'bundle-loader?lazy&name=counter!../pages/Counter/Counter';
// import UserInfo from 'bundle-loader?lazy&name=userInfo!../pages/UserInfo/UserInfo';
import Layout from "bundle-loader?lazy&name=Layout!../pages/Layout";
import Register from "bundle-loader?lazy&name=Register!../pages/Register";
import Login from "bundle-loader?lazy&name=Register!../pages/Login";
import Robot from "bundle-loader?lazy&name=Robot!../pages/Robot";


const Loading = function() {
  return <div>Loading...</div>;
};

const createComponent = component => props => (
  <Bundle load={component}>
    {Component => (Component ? <Component {...props} /> : <Loading />)}
  </Bundle>
);

const getRouter = () => (
  <Router>
      <Switch>
        <Route exact path="/" component={createComponent(Layout)}/>
        <Route path="/register" component={createComponent(Register)} />
        <Route path="/login" component={createComponent(Login)} />
        <Route path="/robot" component={createComponent(Robot)} />
      </Switch>
  </Router>
);

export default getRouter;
