import {combineReducers} from "redux";

import userInfo from './reducers/userInfo';
import robotReducer from '../containers/RobotPage/reducer';
import homePageList from './reducers/homePageList';
import whichShow from './reducers/whichShow';


export default combineReducers({
    userInfo,
    robotState: robotReducer,
    homePageList,
    whichShow
});