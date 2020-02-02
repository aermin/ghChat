import {
  SET_HOME_PAGE_LIST,
  UPDATE_HOME_PAGE_LIST,
  CLEAR_UNREAD,
  DELETE_CHAT_FROM_LIST,
  SHOW_CALL_ME_TIP,
  RELATED_CURRENT_CHAT,
  UPDATE_LIST_GROUP_NAME,
} from './homePageListAction';

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
const getHomePageListReducer = (previousState = [], action) => {
  switch (action.type) {
    case SET_HOME_PAGE_LIST:
    case UPDATE_HOME_PAGE_LIST:
    case CLEAR_UNREAD:
    case DELETE_CHAT_FROM_LIST:
    case SHOW_CALL_ME_TIP:
    case UPDATE_LIST_GROUP_NAME:
      if (userInfo) {
        localStorage.setItem(`homePageList-${userInfo.user_id}`, JSON.stringify(action.data));
      }
      return [...action.data];
    default:
      return previousState;
  }
};

const relatedCurrentChatReducer = (previousState = true, action) => {
  switch (action.type) {
    case RELATED_CURRENT_CHAT:
      return action.data;
    default:
      return previousState;
  }
};

export { getHomePageListReducer, relatedCurrentChatReducer };
