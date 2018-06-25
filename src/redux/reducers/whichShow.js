import {SET_TAB_SHOW , SET_ROBOT_SHOW}  from '../actions/whichShow';

const initState  = {
    tabShow : 1,
    robotShow: false
}

export default function reducer(state = initState, action) {
    console.log(state ,"==tabs==", action)
    switch (action.type) {
        case SET_TAB_SHOW:
            return {
                ...state,
                tabShow: action.data
            };
        case SET_ROBOT_SHOW:
            return {
                ...state,
                robotShow: action.data
            }
        default:
            return state;
        }
}


