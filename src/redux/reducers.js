import { combineReducers } from 'redux';

import robotReducer from '../containers/RobotPage/robotReducer';
import { getAllChatContentReducer, relatedCurrentChatReducer } from './reducers/chatContentReducer';
import { getHomePageListReducer } from '../containers/HomePageList/homePageListReducer';
import { initAppReducer } from '../utils/InitApp/initAppReducer';

export default combineReducers({
  robotState: robotReducer,
  homePageListState: getHomePageListReducer,
  allChatContentState: getAllChatContentReducer,
  relatedCurrentChat: relatedCurrentChatReducer,
  initAppState: initAppReducer,
});
