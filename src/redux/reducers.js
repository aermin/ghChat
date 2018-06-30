import {combineReducers} from "redux";

import userInfo from './reducers/userInfo';
import robot from './reducers/robot';
import homePageList from './reducers/homePageList';
import whichShow from './reducers/whichShow';


export default combineReducers({
    userInfo,
    robot,
    homePageList,
    whichShow
});