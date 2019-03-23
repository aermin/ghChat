import {
  withRouter
} from 'react-router-dom';
import { connect } from 'react-redux';
import { initAppAction } from '../../redux/actions/initAppAction';
import {
  updateHomePageListAction,
  relatedCurrentChatAction,
  setHomePageListAction,
} from '../HomePageList/homePageListAction';
import {
  addGroupMessagesAction,
  addGroupInfoAction,
  addGroupMessageAndInfoAction,
  setAllGroupChatsAction,
} from '../GroupChatPage/groupChatAction';
import {
  addPrivateChatMessagesAction,
  addPrivateChatMessageAndInfoAction,
  setAllPrivateChatsAction,
} from '../PrivateChatPage/privateChatAction';
import MainView from '../../components/MainView';


const mapStateToProps = state => ({
  initializedApp: state.initAppState,
  homePageList: state.homePageListState,
  allGroupChats: state.allGroupChatsState,
  allPrivateChats: state.allPrivateChatsState,
});

const mapDispatchToProps = dispatch => ({
  setHomePageList(arg) {
    dispatch(setHomePageListAction(arg));
  },
  setAllGroupChats(arg = {}) {
    dispatch(setAllGroupChatsAction({ ...arg }));
  },
  setAllPrivateChats(arg = {}) {
    dispatch(setAllPrivateChatsAction({ ...arg }));
  },
  initApp(arg) {
    dispatch(initAppAction(arg));
  },
  addPrivateChatMessages(arg = {}) {
    dispatch(addPrivateChatMessagesAction({ ...arg }));
  },
  addPrivateChatMessageAndInfo(arg = {}) {
    dispatch(addPrivateChatMessageAndInfoAction({ ...arg }));
  },
  addGroupMessageAndInfo(arg = {}) {
    dispatch(addGroupMessageAndInfoAction({ ...arg }));
  },
  addGroupMessages(arg = {}) {
    dispatch(addGroupMessagesAction({ ...arg }));
  },
  addGroupInfo(arg = {}) {
    dispatch(addGroupInfoAction({ ...arg }));
  },
  updateHomePageList(arg = {}) {
    dispatch(updateHomePageListAction({ ...arg }));
  },
  relatedCurrentChat(arg) {
    dispatch(relatedCurrentChatAction(arg));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainView));
