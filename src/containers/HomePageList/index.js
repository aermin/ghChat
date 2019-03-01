import { connect } from 'react-redux';
import HomePageList from '../../components/HomePageList';
import {
  updateHomePageListAction,
} from './homePageListAction';
import {
  relatedCurrentChatAction,
} from '../../redux/actions/chatContentAction';

import {
  addGroupMessagesAction,
  addGroupInfoAction,
} from '../GroupChatPage/groupChatAction';

const mapStateToProps = state => ({
  homePageList: state.homePageListState,
  allGroupChats: state.allGroupChatsState
});

const mapDispatchToProps = dispatch => ({
  // updateAllChatContent(arg = {}) {
  //   dispatch(updateAllChatContentAction({ ...arg }));
  // },
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePageList);
