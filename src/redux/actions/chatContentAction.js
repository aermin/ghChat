import { Map } from 'immutable';

const SET_ALL_CHAT_CONTENT = 'SET_ALL_CHAT_CONTENT';
const RELATED_CURRENT_CHAT = 'RELATED_CURRENT_CHAT';
const UPDATE_ALL_CHAT_CONTENT = 'UPDATE_ALL_CHAT_CONTENT';
const DELETE_CHAT_CONTENT = 'DELETE_CHAT_CONTENT';

const setAllChatContentAction = (allChatContent = {}) => ({
  type: SET_ALL_CHAT_CONTENT,
  data: allChatContent
});

const relatedCurrentChatAction = isRelatedCurrentChat => ({
  type: RELATED_CURRENT_CHAT,
  data: isRelatedCurrentChat
});

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
      allChatContentCopy[chatType].get(mapKey).messages.push(newChatContent);
    } else {
      allChatContentCopy[chatType].set(mapKey, { messages: [newChatContent] });
    }
  } else if (newChatContents) {
    const toGroupId = newChatContents.groupInfo && newChatContents.groupInfo.to_group_id;
    const { messages } = newChatContents;
    toPeople = action === 'send' ? messages[messages.length - 1].to_user : messages[messages.length - 1].from_user;
    mapKey = toGroupId || toPeople;
    chatType = toGroupId ? 'groupChat' : 'privateChat';
    allChatContentCopy[chatType].set(mapKey, newChatContents);
  }
  return {
    type: UPDATE_ALL_CHAT_CONTENT,
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
  setAllChatContentAction,
  relatedCurrentChatAction,
  updateAllChatContentAction,
  deleteChatContentAction
};
