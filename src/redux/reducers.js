import {combineReducers} from "redux";

import robotReducer from '../containers/RobotPage/robotRducer';
import {getHomePageListReducer, getAllChatContentReducer} from '../containers/HomePageList/getHomePageListReducer';
import whichShow from './reducers/whichShow';


export default combineReducers({
    robotState: robotReducer,
    homePageListState: getHomePageListReducer,
    allChatContentState: getAllChatContentReducer,
    whichShow
});