export const SET_TAB_SHOW = "whichShow/SET_TAB_SHOW";
export const SET_ROBOT_SHOW = "whichShow/SET_ROBOT_SHOW";
export const SET_NO_CHAT_SHOW = "whichShow/SET_NO_CHAT_SHOW";

export const setTabShow = data => {
    return {
      type: SET_TAB_SHOW,
      data
    }
}

export const setRobotShow = data => {
  return {
    type: SET_ROBOT_SHOW,
    data
  }
}

export const setNoChatShow = data => {
  return {
    type: SET_NO_CHAT_SHOW,
    data
  }
}