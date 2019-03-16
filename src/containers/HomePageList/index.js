import { connect } from 'react-redux';
import HomePageList from '../../components/HomePageList';
import {
  updateHomePageListAction,
  showCallMeTipAction,
  relatedCurrentChatAction,
} from './homePageListAction';

import {
  addGroupMessagesAction,
  addGroupInfoAction,
  addGroupMessageAndInfoAction,
} from '../GroupChatPage/groupChatAction';
import {
  addPrivateChatMessagesAction,
  addPrivateChatMessageAndInfoAction,
} from '../PrivateChatPage/privateChatAction';

const mapStateToProps = state => ({
  homePageList: state.homePageListState,
  allGroupChats: state.allGroupChatsState,
  allPrivateChats: state.allPrivateChatsState,
});

const mapDispatchToProps = dispatch => ({
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
  },
  showCallMeTip(arg = {}) {
    dispatch(showCallMeTipAction({ ...arg }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePageList);
