import {
  SET_ALL_CHAT_CONTENT, DELETE_CHAT_CONTENT,
  UPDATE_ALL_CHAT_CONTENT, RELATED_CURRENT_CHAT,
  UPDATE_USER_INFO,
} from '../actions/chatContentAction';


const getAllChatContentReducer = (previousState = {}, action) => {
  switch (action.type) {
    case SET_ALL_CHAT_CONTENT:
    case UPDATE_ALL_CHAT_CONTENT:
    case DELETE_CHAT_CONTENT:
    case UPDATE_USER_INFO:
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
  getAllChatContentReducer,
  relatedCurrentChatReducer,
};
