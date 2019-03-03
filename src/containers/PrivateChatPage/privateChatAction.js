const SET_ALL_PRIVATE_CHATS = 'SET_ALL_PRIVATE_CHATS';
const ADD_PRIVATE_CHAT_MESSAGES = 'ADD_PRIVATE_CHAT_MESSAGES';
const ADD_PRIVATE_INFO = 'ADD_PRIVATE_INFO';
const ADD_PRIVATE_CHAT_MESSAGE_AND_INFO = 'ADD_PRIVATE_CHAT_MESSAGE_AND_INFO';

const setAllPrivateChatsAction = ({ data = new Map() }) => ({
  type: SET_ALL_PRIVATE_CHATS,
  data
});

const addPrivateChatMessagesAction = ({
  allPrivateChats, messages, message, chatId, inLazyLoading
}) => {
  const allPrivateChatsCopy = new Map(allPrivateChats);
  const goalPrivateChat = allPrivateChatsCopy.get(chatId);
  const originMessages = goalPrivateChat && goalPrivateChat.messages || [];
  const newMessages = messages || [message];
  if (goalPrivateChat) {
    const finalMessages = inLazyLoading ? [...newMessages, ...originMessages] : [...originMessages, ...newMessages];
    allPrivateChatsCopy.get(chatId).messages = finalMessages;
  } else {
    allPrivateChatsCopy.set(chatId, { messages: newMessages });
  }
  return { type: ADD_PRIVATE_CHAT_MESSAGES, data: allPrivateChatsCopy };
};

const addPrivateChatInfoAction = ({
  allPrivateChats, chatId, userInfo,
}) => {
  if (!userInfo.user_id) throw new Error('not exist userInfo.user_id!');
  const allPrivateChatsCopy = new Map(allPrivateChats);
  const goalPrivateChat = allPrivateChatsCopy.get(chatId);
  if (goalPrivateChat) {
    allPrivateChatsCopy.get(chatId).userInfo = userInfo;
  } else {
    allPrivateChatsCopy.set(chatId, { userInfo });
  }
  return { type: ADD_PRIVATE_INFO, data: allPrivateChatsCopy };
};

const addPrivateChatMessageAndInfoAction = ({
  allPrivateChats, messages, message, chatId, userInfo,
}) => {
  const res = addPrivateChatMessagesAction({
    allPrivateChats, messages, message, chatId
  });
  const { data } = addPrivateChatInfoAction({
    allPrivateChats: res.data, chatId, userInfo,
  });
  return { type: ADD_PRIVATE_CHAT_MESSAGE_AND_INFO, data };
};


export {
  SET_ALL_PRIVATE_CHATS,
  ADD_PRIVATE_CHAT_MESSAGES,
  ADD_PRIVATE_INFO,
  ADD_PRIVATE_CHAT_MESSAGE_AND_INFO,
  setAllPrivateChatsAction,
  addPrivateChatMessagesAction,
  addPrivateChatInfoAction,
  addPrivateChatMessageAndInfoAction,
};
