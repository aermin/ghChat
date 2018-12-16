import { List, Map } from 'immutable';

const UPDATE_HOME_PAGE_LIST = 'UPDATE_HOME_PAGE_LIST';
const UPDATE_ALL_CHAT_CONTENT = 'UPDATE_ALL_CHAT_CONTENT';
const RELATED_CURRENT_CHAT = 'RELATED_CURRENT_CHAT';

const updateHomePageListAction = ({ homePageList, data, myUserId }) => {
  const homePageListCopy = [...List(homePageList)];
  const userId = data.from_user === myUserId ? data.to_user : data.from_user;
  const chatFromId = data.type === 'private' ? userId : data.to_group;
  const chatExist = homePageListCopy.find(e => e.id === chatFromId);
  if (chatExist) {
    const length = homePageListCopy.length;
    for (let i = 0; i < length; i++) {
      if (homePageListCopy[i].id === chatFromId) {
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

const updateAllChatContentByGotAction = ({ allChatContent, newChatContent, chatType }) => {
  const allChatContentCopy = Map(allChatContent).toObject();
  const mapKey = chatType === 'privateChat' ? newChatContent.from_user : newChatContent.groupId;
  console.log('allChatContentCopy by got', allChatContentCopy, chatType, newChatContent);
  allChatContentCopy[chatType].get(mapKey).privateDetail.push(newChatContent);
  return {
    type: UPDATE_ALL_CHAT_CONTENT,
    data: allChatContentCopy
  };
};

const updateAllChatContentBySentAction = ({ allChatContent, newChatContent, chatType }) => {
  const allChatContentCopy = Map(allChatContent).toObject();
  const mapKey = chatType === 'privateChat' ? newChatContent.to_user : newChatContent.groupId;
  console.log('allChatContentCopy by sent', allChatContentCopy, chatType, newChatContent);
  allChatContentCopy[chatType].get(mapKey).privateDetail.push(newChatContent);
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
  updateAllChatContentByGotAction,
  updateAllChatContentBySentAction,
  relatedCurrentChatAction,
};
