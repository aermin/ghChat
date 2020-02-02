import { SHARE } from '../actions/shareAction';

const shareReducer = (previousState = null, action) => {
  switch (action.type) {
    case SHARE:
      return action.data;
    default:
      return previousState;
  }
};

export { shareReducer };
