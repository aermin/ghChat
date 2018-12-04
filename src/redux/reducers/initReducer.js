import { GET_HOME_PAGE_LIST, GET_ALL_CHAT_CONTENT } from '../actions/initAction';
import { UPDATE_ALL_CHAT_CONTENT } from '../../containers/PrivateChatPage/privateChatAction';
import { UPDATE_HOME_PAGE_LIST } from '../../containers/HomePageList/homePapeListAction';

const getHomePageListReducer = (previousState = [], action) => {
  switch (action.type) {
    case GET_HOME_PAGE_LIST:
      return action.data;
    case UPDATE_HOME_PAGE_LIST:
      console.log(previousState, 'UPDATE_HOME_PAGE_LIST233', action);
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

export {
  getHomePageListReducer,
  getAllChatContentReducer
};
