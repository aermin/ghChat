import { List, Map } from 'immutable';

const UPDATE_HOME_PAGE_LIST = 'UPDATE_HOME_PAGE_LIST';
const UPDATE_ALL_CHAT_CONTENT = 'UPDATE_ALL_CHAT_CONTENT';
const RELATED_CURRENT_CHAT = 'RELATED_CURRENT_CHAT';

const updateHomePageListAction = ({ homePageList, data, myUserId }) => {
  const homePageListCopy = [...List(homePageList)];
  let chatFromId;
  if (data.to_user) {
    chatFromId = data.from_user === myUserId ? data.to_user : data.from_user;
  } else if (data.to_group_id) {
    chatFromId = data.to_group_id;
  }
  const chatExist = homePageListCopy.find(e => e.to_user == chatFromId || e.to_group_id == chatFromId);
  console.log('chatFromId, chatExist', chatFromId, chatExist);
  if (chatExist) {
    const length = homePageListCopy.length;
    for (let i = 0; i < length; i++) {
      if (homePageListCopy[i].to_user === chatFromId || homePageListCopy[i].to_group_id === chatFromId) {
        homePageListCopy[i] = { ...homePageListCopy[i], message: data.message, time: data.time };
        break;
      }
    }
  } else {
    homePageListCopy.push(data);
  }
  return {
    type: UPDATE_HOME_PAGE_LIST,
    data: homePageListCopy
  };
};

const updateAllChatContentAction = ({ allChatContent, newChatContent, action }) => {
  const allChatContentCopy = Map(allChatContent).toObject();
  const toPeople = action === 'send' ? newChatContent.to_user : newChatContent.from_user;
  const mapKey = newChatContent.to_group_id ? newChatContent.to_group_id : toPeople;
  const chatType = newChatContent.to_group_id ? 'groupChat' : 'privateChat';
  console.log('allChatContentCopy by got', allChatContentCopy, chatType, newChatContent);
  if (allChatContentCopy[chatType].get(mapKey)) {
    allChatContentCopy[chatType].get(mapKey).messages.push(newChatContent);
  // There is no this this chat，such as creating new group or before fist private chat
  } else {
    allChatContentCopy[chatType].set(mapKey, { messages: [newChatContent] });
  }

  return {
    type: UPDATE_ALL_CHAT_CONTENT,
    data: allChatContentCopy
  };
};

const relatedCurrentChatAction = isRelatedCurrentChat => ({
  type: RELATED_CURRENT_CHAT,
  data: isRelatedCurrentChat
});

export {
  UPDATE_HOME_PAGE_LIST,
  UPDATE_ALL_CHAT_CONTENT,
  RELATED_CURRENT_CHAT,
  updateHomePageListAction,
  updateAllChatContentAction,
  relatedCurrentChatAction,
};
