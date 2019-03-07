import { connect } from 'react-redux';
import HomePageList from '../../components/HomePageList';
import {
  updateHomePageListAction,
  showCallMeTipAction,
} from './homePageListAction';
import {
  relatedCurrentChatAction,
} from '../../redux/actions/chatContentAction';

import {
  addGroupMessagesAction,
  addGroupInfoAction,
  addGroupMessageAndInfoAction,
} from '../GroupChatPage/groupChatAction';
import {
  addPrivateChatMessagesAction,
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
