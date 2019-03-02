import {
  SET_ALL_PRIVATE_CHATS,
  ADD_PRIVATE_CHAT_MESSAGES,
  ADD_PRIVATE_INFO,
  ADD_PRIVATE_CHAT_MESSAGE_AND_INFO,
} from './privateChatAction';

const fetchAllPrivateChatsReducer = (previousState = new Map(), action) => {
  switch (action.type) {
    case SET_ALL_PRIVATE_CHATS:
    case ADD_PRIVATE_CHAT_MESSAGES:
    case ADD_PRIVATE_INFO:
    case ADD_PRIVATE_CHAT_MESSAGE_AND_INFO:
      return action.data;
    default:
      return previousState;
  }
};

export {
  fetchAllPrivateChatsReducer,
};
