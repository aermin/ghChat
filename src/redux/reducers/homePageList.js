import GET_HOME_PAGE_LIST  from '../actions/homePageList';

const initState  = {
    allMsgList: []
}

export default function reducer(state = initState, action) {
    console.log(state ,"====", action)
    switch (action.type) {
        case GET_HOME_PAGE_LIST:
            return {
                ...state,
                allMsgList:action.data
            };
        default:
            return state;
        }
}