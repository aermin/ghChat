import {
  SET_HOME_PAGE_LIST, UPDATE_HOME_PAGE_LIST,
  CLEAR_UNREAD, DELETE_CHAT_FROM_LIST,
  SHOW_CALL_ME_TIP,
} from './homePageListAction';

const getHomePageListReducer = (previousState = [], action) => {
  switch (action.type) {
    case SET_HOME_PAGE_LIST:
    case UPDATE_HOME_PAGE_LIST:
    case CLEAR_UNREAD:
    case DELETE_CHAT_FROM_LIST:
    case SHOW_CALL_ME_TIP:
      return [...action.data];
    default:
      return previousState;
  }
};

export {
  getHomePageListReducer,
};
