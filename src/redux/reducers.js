import {combineReducers} from "redux";

import counter from './reducers/counter';
import userInfo from './reducers/userInfo';
import robot from './reducers/robot';
import homePageList from './reducers/homePageList';
import tabs from './reducers/tabs';


export default combineReducers({
    counter,
    userInfo,
    robot,
    homePageList,
    tabs
});