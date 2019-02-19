import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import {
  updateHomePageListAction,
  deleteHomePageListAction,
  clearUnreadAction
} from '../HomePageList/homePageListAction';
import {
  updateAllChatContentAction,
  deleteChatContentAction
} from '../../redux/actions/chatContentAction';

import GroupChat from '../../components/GroupChat';

const mapStateToProps = state => ({
  allChatContent: state.allChatContentState,
  homePageList: state.homePageListState,
  relatedCurrentChat: state.relatedCurrentChat
});

const mapDispatchToProps = dispatch => ({
  updateAllChatContent(arg = {}) {
    dispatch(updateAllChatContentAction({ ...arg }));
  },
  updateHomePageList(arg = {}) {
    dispatch(updateHomePageListAction({ ...arg }));
  },
  deleteHomePageList(arg = {}) {
    dispatch(deleteHomePageListAction({ ...arg }));
  },
  deleteChatContent(arg = {}) {
    dispatch(deleteChatContentAction({ ...arg }));
  },
  clearUnread(arg = {}) {
    dispatch(clearUnreadAction({ ...arg }));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GroupChat));
