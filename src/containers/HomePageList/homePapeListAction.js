import { List, Map } from 'immutable';

const UPDATE_HOME_PAGE_LIST = 'UPDATE_HOME_PAGE_LIST';
const UPDATE_ALL_CHAT_CONTENT = 'UPDATE_ALL_CHAT_CONTENT';
const RELATED_CURRENT_CHAT = 'RELATED_CURRENT_CHAT';

const updateHomePageListAction = ({ homePageList, data, myUserId }) => {
  const homePageListCopy = [...List(homePageList)];
  let chatFromId;
  if (data.to_user) {
    chatFromId = data.from_user === myUserId ? data.to_user : data.from_user;
    data.user_id = chatFromId;
  } else if (data.to_group_id) {
    chatFromId = data.to_group_id;
  }
  const chatExist = homePageListCopy.find(e => e.user_id === chatFromId || e.to_group_id === chatFromId);
  console.log('chatFromId, chatExist', chatFromId, chatExist);
  if (chatExist) {
    const length = homePageListCopy.length;
    for (let i = 0; i < length; i++) {
      if (homePageListCopy[i].user_id === chatFromId || homePageListCopy[i].to_group_id === chatFromId) {
        homePageListCopy[i] = Object.assign(homePageListCopy[i], { message: data.message, time: data.time });
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
