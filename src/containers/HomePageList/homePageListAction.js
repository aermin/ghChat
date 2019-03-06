import { List } from 'immutable';

const UPDATE_HOME_PAGE_LIST = 'UPDATE_HOME_PAGE_LIST';
const CLEAR_UNREAD = 'CLEAR_UNREAD';
const DELETE_CHAT_FROM_LIST = 'DELETE_CHAT_FROM_LIST';
const SET_HOME_PAGE_LIST = 'SET_HOME_PAGE_LIST';

// TODO: 重构和代码注释
const updateHomePageListAction = ({
  homePageList, data, myUserId, increaseUnread = false
}) => {
  const homePageListCopy = [...List(homePageList)];
  let chatFromId;
  if (data && data.to_user) {
    chatFromId = data.from_user === myUserId ? data.to_user : data.from_user;
    data.user_id = chatFromId;
  } else if (data && data.to_group_id) {
    chatFromId = data.to_group_id;
  }
  const chatExist = homePageListCopy.find(e => e.user_id === chatFromId || e.to_group_id === chatFromId);
  if (chatExist) {
    const length = homePageListCopy.length;
    for (let i = 0; i < length; i++) {
      const { user_id, to_group_id, unread = 0 } = homePageListCopy[i];
      if (user_id === chatFromId || to_group_id === chatFromId) {
        const updatedUnread = increaseUnread ? unread + 1 : unread;
        homePageListCopy[i] = Object.assign(homePageListCopy[i], {
          message: data.message, time: data.time, unread: updatedUnread
        });
        break;
      }
    }
  } else {
    data.unread = increaseUnread ? 1 : 0;
    homePageListCopy.push(data);
  }
  return {
    type: UPDATE_HOME_PAGE_LIST,
    data: homePageListCopy
  };
};

const deleteHomePageListAction = ({
  homePageList, chatId
}) => {
  const homePageListCopy = [...List(homePageList)];
  const length = homePageListCopy.length;
  for (let i = 0; i < length; i++) {
    const { to_group_id, user_id } = homePageListCopy[i];
    const id = to_group_id || user_id;
    if (chatId === id) {
      const deletedItem = homePageListCopy.splice(i, 1);
      console.log('deletedItem', deletedItem);
      break;
    }
  }
  return {
    type: DELETE_CHAT_FROM_LIST,
    data: homePageListCopy
  };
};

const clearUnreadAction = ({ chatFromId, homePageList }) => {
  const homePageListCopy = [...List(homePageList)];
  const length = homePageListCopy.length;
  for (let i = 0; i < length; i++) {
    const { user_id, to_group_id } = homePageListCopy[i];
    if ((user_id && user_id.toString()) === (chatFromId && chatFromId.toString())
        || to_group_id === chatFromId) {
      homePageListCopy[i].unread = 0;
      break;
    }
  }
  return {
    type: CLEAR_UNREAD,
    data: homePageListCopy
  };
};

const setHomePageListAction = (homePageList = []) => ({
  type: SET_HOME_PAGE_LIST,
  data: homePageList
});

export {
  UPDATE_HOME_PAGE_LIST,
  CLEAR_UNREAD,
  DELETE_CHAT_FROM_LIST,
  SET_HOME_PAGE_LIST,
  updateHomePageListAction,
  clearUnreadAction,
  deleteHomePageListAction,
  setHomePageListAction,
};
