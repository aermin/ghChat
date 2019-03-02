import { combineReducers } from 'redux';

import robotReducer from '../containers/RobotPage/robotReducer';
import { relatedCurrentChatReducer } from './reducers/chatContentReducer';
import { getHomePageListReducer } from '../containers/HomePageList/homePageListReducer';
import { initAppReducer } from './reducers/initAppReducer';
import { fetchAllGroupChatsReducer } from '../containers/GroupChatPage/groupChatReducer';
import { fetchAllPrivateChatsReducer } from '../containers/PrivateChatPage/privateChatReducer';

export default combineReducers({
  robotState: robotReducer,
  homePageListState: getHomePageListReducer,
  allGroupChatsState: fetchAllGroupChatsReducer,
  allPrivateChatsState: fetchAllPrivateChatsReducer,
  relatedCurrentChat: relatedCurrentChatReducer,
  initAppState: initAppReducer,
});
