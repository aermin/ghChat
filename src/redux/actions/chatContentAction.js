import { Map } from 'immutable';

const SET_ALL_CHAT_CONTENT = 'SET_ALL_CHAT_CONTENT';
const RELATED_CURRENT_CHAT = 'RELATED_CURRENT_CHAT';
const UPDATE_ALL_CHAT_CONTENT = 'UPDATE_ALL_CHAT_CONTENT';
const DELETE_CHAT_CONTENT = 'DELETE_CHAT_CONTENT';
const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
const UPDATE_GROUP_MESSAGES = 'UPDATE_GROUP_MESSAGES';

const setAllChatContentAction = (allChatContent = {}) => ({
  type: SET_ALL_CHAT_CONTENT,
  data: allChatContent
});

const relatedCurrentChatAction = isRelatedCurrentChat => ({
  type: RELATED_CURRENT_CHAT,
  data: isRelatedCurrentChat
});

// TODO: 改下变量名newChatContent => messages; newChatContents => chatItem
// TODO: 重构解耦
const updateAllChatContentAction = ({
  allChatContent, newChatContent, newChatContents, action
}) => {
  const allChatContentCopy = Map(allChatContent).toObject();
  let toPeople;
  let mapKey;
  let chatType;
  if (newChatContent) {
    const toGroupId = newChatContent.to_group_id;
    toPeople = action === 'send' ? newChatContent.to_user : newChatContent.from_user;
    mapKey = toGroupId || toPeople;
    chatType = toGroupId ? 'groupChat' : 'privateChat';
    if (allChatContentCopy[chatType].get(mapKey)) {
      if (!allChatContentCopy[chatType].get(mapKey).messages) allChatContentCopy[chatType].get(mapKey).messages = [];
      allChatContentCopy[chatType].get(mapKey).messages.push(newChatContent);
    } else {
      allChatContentCopy[chatType].set(mapKey, { messages: [newChatContent] });
    }
  } else if (newChatContents) {
    const toGroupId = newChatContents.groupInfo && newChatContents.groupInfo.to_group_id;
    const { messages } = newChatContents;
    if (messages.length > 0) {
      toPeople = action === 'send' ? messages[messages.length - 1].to_user : messages[messages.length - 1].from_user;
    }
    mapKey = toGroupId || toPeople;
    chatType = toGroupId ? 'groupChat' : 'privateChat';
    allChatContentCopy[chatType].set(mapKey, newChatContents);
  }
  return {
    type: UPDATE_ALL_CHAT_CONTENT,
    data: allChatContentCopy
  };
};

const updateUserInfoAction = ({
  allChatContent, userInfo
}) => {
  const allChatContentCopy = Map(allChatContent).toObject();
  if (!userInfo.user_id) throw new Error('not exist userInfo.user_id!');
  allChatContentCopy.privateChat.set(userInfo.user_id, { userInfo });
  return {
    type: UPDATE_USER_INFO,
    data: allChatContentCopy
  };
};

const deleteChatContentAction = ({ allChatContent, chatId, chatType }) => {
  const allChatContentCopy = Map(allChatContent).toObject();
  allChatContentCopy[chatType].delete(chatId);
  return {
    type: DELETE_CHAT_CONTENT,
    data: allChatContentCopy
  };
};

export {
  SET_ALL_CHAT_CONTENT,
  RELATED_CURRENT_CHAT,
  UPDATE_ALL_CHAT_CONTENT,
  DELETE_CHAT_CONTENT,
  UPDATE_USER_INFO,
  setAllChatContentAction,
  relatedCurrentChatAction,
  updateAllChatContentAction,
  deleteChatContentAction,
  updateUserInfoAction
};
