import {SET_CURRENT_TABS}  from '../actions/tabs';

const initState  = {
    currentTab : 1
}

export default function reducer(state = initState, action) {
    console.log(state ,"==tabs==", action)
    switch (action.type) {
        case SET_CURRENT_TABS:
            return {
                ...state,
                currentTab: action.data
            };
        default:
            return state;
        }
}