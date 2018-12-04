import { List } from 'immutable';

const UPDATE_HOME_PAGE_LIST = 'UPDATE_HOME_PAGE_LIST';

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

export {
  UPDATE_HOME_PAGE_LIST,
  updateHomePageListAction,
};
