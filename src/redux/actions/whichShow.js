export const SET_TAB_SHOW = "whichShow/SET_TAB_SHOW";
export const SET_ROBOT_SHOW = "whichShow/SET_ROBOT_SHOW";

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