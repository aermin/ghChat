import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  updateHomePageListAction,
  deleteHomePageListAction,
} from '../HomePageList/homePageListAction';
import {
  addPrivateChatMessagesAction,
  addPrivateChatInfoAction,
  deletePrivateChatAction,
} from './privateChatAction';
import PrivateChat from '../../components/PrivateChat';

const mapStateToProps = state => ({
  allPrivateChats: state.allPrivateChatsState,
  homePageList: state.homePageListState,
  relatedCurrentChat: state.relatedCurrentChat,
  shareData: state.shareState,
  allGroupChats: state.allGroupChatsState,
  initApp: state.initAppState,
});

const mapDispatchToProps = dispatch => ({
  addPrivateChatMessages(arg = {}) {
    dispatch(addPrivateChatMessagesAction({ ...arg }));
  },
  addPrivateChatInfo(arg = {}) {
    dispatch(addPrivateChatInfoAction({ ...arg }));
  },
  updateHomePageList(arg = {}) {
    dispatch(updateHomePageListAction({ ...arg }));
  },
  deleteHomePageList(arg = {}) {
    dispatch(deleteHomePageListAction({ ...arg }));
  },
  deletePrivateChat(arg = {}) {
    dispatch(deletePrivateChatAction({ ...arg }));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateChat));
