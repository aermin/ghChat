import {combineReducers} from "redux";

import counter from './reducers/counter';
import userInfo from './reducers/userInfo';
import robot from './reducers/robot';

export default combineReducers({
    counter,
    userInfo,
    robot
});