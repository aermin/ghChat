import { combineReducers } from 'redux';

import robotReducer from '../containers/RobotPage/robotReducer';
import {
  getHomePageListReducer,
  relatedCurrentChatReducer,
} from '../containers/HomePageList/homePageListReducer';
import { initAppReducer } from './reducers/initAppReducer';
import { shareReducer } from './reducers/shareReducer';
import { fetchAllGroupChatsReducer } from '../containers/GroupChatPage/groupChatReducer';
import { fetchAllPrivateChatsReducer } from '../containers/PrivateChatPage/privateChatReducer';
import { setGlobalSettingsReducer } from '../containers/SettingPage/settingReducer';

export default combineReducers({
  robotState: robotReducer,
  homePageListState: getHomePageListReducer,
  allGroupChatsState: fetchAllGroupChatsReducer,
  allPrivateChatsState: fetchAllPrivateChatsReducer,
  relatedCurrentChat: relatedCurrentChatReducer,
  initAppState: initAppReducer,
  shareState: shareReducer,
  globalSettingsState: setGlobalSettingsReducer,
});
