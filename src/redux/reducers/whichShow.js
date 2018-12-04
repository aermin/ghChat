import { SET_TAB_SHOW, SET_ROBOT_SHOW, SET_NO_CHAT_SHOW } from '../actions/whichShow';

const initState = {
  tabShow: 1,
  robotShow: false,
  noChatShow: true
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case SET_TAB_SHOW:
      console.log('SET_TAB_SHOW', action.data);
      return {
        ...state,
        tabShow: action.data
      };
    case SET_ROBOT_SHOW:
      console.log('SET_ROBOT_SHOW', action.data);
      return {
        ...state,
        robotShow: action.data
      };
    case SET_NO_CHAT_SHOW:
      console.log('SET_NO_CHAT_SHOW', action.data);
      return {
        ...state,
        noChatShow: action.data
      };
      // case SET_LAYOUT_LEFT_SHOW:
      //     return {
      //         ...state,
      //         layoutLeftShow: action.data
      //     }
      // case SET_LAYOUT_RIGHT_SHOW:
      //     return {
      //         ...state,
      //         layoutRightShow: action.data
      //     }
    default:
      return state;
  }
}
