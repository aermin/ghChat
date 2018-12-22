import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import { updateHomePageListAction, updateAllChatContentBySentAction } from '../HomePageList/homePapeListAction';

import GroupChat from '../../components/GroupChat';
// import '../../assets/chat.scss';

const mapStateToProps = state => ({
  allChatContent: state.allChatContentState,
  homePageList: state.homePageListState,
  relatedCurrentChat: state.relatedCurrentChat
});

const mapDispatchToProps = dispatch => ({
  // updateAllChatContentByGot(arg = {}) {
  //   dispatch(updateAllChatContentByGotAction({ ...arg }));
  // },
  updateAllChatContentBySent(arg = {}) {
    dispatch(updateAllChatContentBySentAction({ ...arg }));
  },
  updateHomePageList(arg = {}) {
    dispatch(updateHomePageListAction({ ...arg }));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GroupChat));
