import {
  SET_ALL_PRIVATE_CHATS,
} from './privateChatAction';

const fetchAllPrivateChatsReducer = (previousState = {}, action) => {
  switch (action.type) {
    case SET_ALL_PRIVATE_CHATS:
      return action.data;
    default:
      return previousState;
  }
};

export {
  fetchAllPrivateChatsReducer,
};
