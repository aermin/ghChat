export const SET_CURRENT_TABS = "tabs/SET_CURRENT_TABS";

export const setCurrentTab = data => {
    return {
      type: SET_CURRENT_TABS,
      data
    }
}