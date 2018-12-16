import { connect } from 'react-redux';
import HomePageList from '../../components/HomePageList';
import {
  updateHomePageListAction, updateAllChatContentByGotAction,
  updateAllChatContentBySentAction, relatedCurrentChatAction
} from './homePapeListAction';

const mapStateToProps = state => ({
  homePageList: state.homePageListState,
  allChatContent: state.allChatContentState
});

const mapDispatchToProps = dispatch => ({
  updateAllChatContentByGot(arg = {}) {
    dispatch(updateAllChatContentByGotAction({ ...arg }));
  },
  updateAllChatContentBySent(arg = {}) {
    dispatch(updateAllChatContentBySentAction({ ...arg }));
  },
  updateHomePageList(arg = {}) {
    dispatch(updateHomePageListAction({ ...arg }));
  },
  relatedCurrentChat(arg) {
    dispatch(relatedCurrentChatAction(arg));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePageList);
