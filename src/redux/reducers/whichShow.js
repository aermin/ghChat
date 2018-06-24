import {SET_TAB_SHOW}  from '../actions/whichShow';

const initState  = {
    tabShow : 1
}

export default function reducer(state = initState, action) {
    console.log(state ,"==tabs==", action)
    switch (action.type) {
        case SET_TAB_SHOW:
            return {
                ...state,
                tabShow: action.data
            };
        default:
            return state;
        }
}