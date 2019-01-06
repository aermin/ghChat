import { connect } from 'react-redux';
import HomePageList from '../../components/HomePageList';
import {
  updateHomePageListAction, updateAllChatContentAction, relatedCurrentChatAction
} from './homePapeListAction';

const mapStateToProps = state => ({
  homePageList: state.homePageListState,
  allChatContent: state.allChatContentState
});

const mapDispatchToProps = dispatch => ({
  updateAllChatContent(arg = {}) {
    dispatch(updateAllChatContentAction({ ...arg }));
  },
  updateHomePageList(arg = {}) {
    dispatch(updateHomePageListAction({ ...arg }));
  },
  relatedCurrentChat(arg) {
    dispatch(relatedCurrentChatAction(arg));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePageList);
