import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import {
  updateHomePageListAction,
} from '../HomePageList/homePageListAction';
import {
  addPrivateChatMessagesAction,
  addPrivateChatInfoAction,
} from './privateChatAction';
import PrivateChat from '../../components/PrivateChat';

const mapStateToProps = state => ({
  allPrivateChats: state.allPrivateChatsState,
  homePageList: state.homePageListState,
  relatedCurrentChat: state.relatedCurrentChat,
  inviteData: state.inviteState,
  allGroupChats: state.allGroupChatsState,
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateChat));
