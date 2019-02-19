import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import {
  updateHomePageListAction,
  clearUnreadAction
} from '../HomePageList/homePageListAction';
import {
  updateAllChatContentAction,
  updateUserInfoAction
} from '../../redux/actions/chatContentAction';
import PrivateChat from '../../components/PrivateChat';
import '../../assets/chat.scss';

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
  updateUserInfo(arg = {}) {
    dispatch(updateUserInfoAction({ ...arg }));
  },
  clearUnread(arg = {}) {
    dispatch(clearUnreadAction({ ...arg }));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateChat));
