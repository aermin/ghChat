import { combineReducers } from 'redux';

import robotReducer from '../containers/RobotPage/robotRducer';
import { getAllChatContentReducer, relatedCurrentChatReducer } from './reducers/chatContentReducer';
import { getHomePageListReducer } from '../containers/HomePageList/homePageListReducer';

export default combineReducers({
  robotState: robotReducer,
  homePageListState: getHomePageListReducer,
  allChatContentState: getAllChatContentReducer,
  relatedCurrentChat: relatedCurrentChatReducer,
});
