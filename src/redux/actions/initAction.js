const SET_HOME_PAGE_LIST = 'SET_HOME_PAGE_LIST';
const SET_ALL_CHAT_CONTENT = 'SET_ALL_CHAT_CONTENT';

const setHomePageListAction = (homePageList = []) => ({
  type: SET_HOME_PAGE_LIST,
  data: homePageList
});

const setAllChatContentAction = (allChatContent = {}) => ({
  type: SET_ALL_CHAT_CONTENT,
  data: allChatContent
});

export {
  SET_HOME_PAGE_LIST,
  SET_ALL_CHAT_CONTENT,
  setHomePageListAction,
  setAllChatContentAction,
};
