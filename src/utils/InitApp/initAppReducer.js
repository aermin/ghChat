import { INIT_APP } from './initAppAction';


const initAppReducer = (previousState = false, action) => {
  switch (action.type) {
    case INIT_APP:
      return true;
    default:
      return previousState;
  }
};

export {
  initAppReducer,
};
