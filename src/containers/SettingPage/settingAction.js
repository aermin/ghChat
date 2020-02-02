const SET_GLOBAL_SETTINGS = 'SET_GLOBAL_SETTINGS';

const setGlobalSettingsAction = (globalSettings = {}) => ({
  type: SET_GLOBAL_SETTINGS,
  data: globalSettings,
});

export { SET_GLOBAL_SETTINGS, setGlobalSettingsAction };
