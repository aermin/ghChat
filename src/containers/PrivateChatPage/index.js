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
import '../../assets/chat.scss';

const mapStateToProps = state => ({
  allPrivateChats: state.allPrivateChatsState,
  homePageList: state.homePageListState,
  relatedCurrentChat: state.relatedCurrentChat
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
