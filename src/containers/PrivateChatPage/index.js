import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import { updateHomePageListAction, updateAllChatContentBySentAction } from '../HomePageList/homePapeListAction';

import PrivateChat from '../../components/PrivateChat';
import '../../assets/chat.scss';

const mapStateToProps = state => ({
  allChatContent: state.allChatContentState,
  homePageList: state.homePageListState
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateChat));
