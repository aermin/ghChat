import { GET_HOME_PAGE_LIST, GET_ALL_CHAT_CONTENT } from '../actions/initAction';
import { UPDATE_ALL_CHAT_CONTENT } from '../../containers/PrivateChatPage/privateChatAction';
import { UPDATE_HOME_PAGE_LIST, RELATED_CURRENT_CHAT } from '../../containers/HomePageList/homePapeListAction';

const getHomePageListReducer = (previousState = [], action) => {
  switch (action.type) {
    case GET_HOME_PAGE_LIST:
      return action.data;
    case UPDATE_HOME_PAGE_LIST:
      return action.data;
    default:
      return previousState;
  }
};


const getAllChatContentReducer = (previousState = {}, action) => {
  switch (action.type) {
    case GET_ALL_CHAT_CONTENT:
      return action.data;
    case UPDATE_ALL_CHAT_CONTENT:
      return action.data;
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

export {
  getHomePageListReducer,
  getAllChatContentReducer,
  relatedCurrentChatReducer,
};
