import { combineReducers } from 'redux';

import robotReducer from '../containers/RobotPage/robotRducer';
import { getHomePageListReducer, getAllChatContentReducer, relatedCurrentChatReducer } from './reducers/initReducer';
import whichShow from './reducers/whichShow';


export default combineReducers({
  robotState: robotReducer,
  homePageListState: getHomePageListReducer,
  allChatContentState: getAllChatContentReducer,
  relatedCurrentChat: relatedCurrentChatReducer,
  whichShow
});
