import {combineReducers} from "redux";

import robotReducer from '../containers/RobotPage/reducer';
import {getHomePageListReducer} from '../containers/HomePageList/getHomePageListReducer';
import whichShow from './reducers/whichShow';


export default combineReducers({
    robotState: robotReducer,
    homePageListState: getHomePageListReducer,
    whichShow
});