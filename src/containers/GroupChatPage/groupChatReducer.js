import {
  SET_ALL_GROUP_CHATS,
  ADD_GROUP_MESSAGES,
  DELETE_GROUP_CHAT,
  ADD_GROUP_INFO,
  ADD_GROUP_MESSAGE_AND_INFO,
} from './groupChatAction';

const fetchAllGroupChatsReducer = (previousState = new Map(), action) => {
  switch (action.type) {
    case SET_ALL_GROUP_CHATS:
    case ADD_GROUP_MESSAGES:
    case DELETE_GROUP_CHAT:
    case ADD_GROUP_INFO:
    case ADD_GROUP_MESSAGE_AND_INFO:
      return action.data;
    default:
      return previousState;
  }
};

export {
  fetchAllGroupChatsReducer,
};
