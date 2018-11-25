import {GET_HOME_PAGE_LIST, GET_ALL_CHAT_CONTENT}  from './getHomePageListAction';
import {UPDATE_ALL_CHAT_CONTENT} from '../PrivateChatPage/privateChatAction'

const getHomePageListReducer = (state = [], action) => {
    switch (action.type) {
        case GET_HOME_PAGE_LIST:
            return [...action.data];
        default:
            return state;
    }
}


const getAllChatContentReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_CHAT_CONTENT:
            return action.data;
        case UPDATE_ALL_CHAT_CONTENT:
            return action.data;
        default:
            return state;
    }
}

export {
    getHomePageListReducer,
    getAllChatContentReducer
}