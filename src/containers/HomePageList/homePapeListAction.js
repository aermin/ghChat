import { List } from 'immutable';
const UPDATE_HOME_PAGE_LIST = "UPDATE_HOME_PAGE_LIST";

const updateHomePageListAction = ({homePageList, data}) => {
  const homePageListCopy = [...List(homePageList)];
  const chatFromId = data.type === 'private' ? data.from_user : data.to_group;
  const chatExist = homePageListCopy.find((e) => e.id === chatFromId);
  if (chatExist) {
    const length = homePageListCopy.length;
    for(let i = 0; i < length; i ++){
        if (homePageListCopy[i].id === chatFromId) {
          homePageListCopy[i] = {...homePageListCopy[i], message: data.message, time: data.time };
          break;
        }
    }
  } else {
    homePageListCopy.push(data);
  }
  return {
    type: UPDATE_HOME_PAGE_LIST,
    data: homePageListCopy
  }
}

export {
  UPDATE_HOME_PAGE_LIST,
  updateHomePageListAction,
}