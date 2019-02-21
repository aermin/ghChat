const INIT_APP = 'INIT_APP';


const initAppAction = (status = false) => ({
  type: INIT_APP,
  data: status
});

export {
  INIT_APP,
  initAppAction,
};
