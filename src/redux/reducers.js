import {combineReducers} from "redux";

import counter from './reducers/counter';
import userInfo from './reducers/userInfo';

export default combineReducers({
    counter,
    userInfo
});