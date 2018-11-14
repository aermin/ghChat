import {GET_HOME_PAGE_LIST}  from './getHomePageListAction';

export const getHomePageListReducer = (state = [], action) => {
    switch (action.type) {
        case GET_HOME_PAGE_LIST:
            return [...action.data];
        default:
            return state;
        }
}