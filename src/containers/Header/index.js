import { connect } from 'react-redux';
import {
  withRouter
} from 'react-router-dom';
import { updateHomePageListAction, updateAllChatContentAction } from '../HomePageList/homePapeListAction';
import Header from '../../components/Header';

const mapStateToProps = state => ({
  allChatContent: state.allChatContentState,
  homePageList: state.homePageListState,
});

const mapDispatchToProps = dispatch => ({
  updateAllChatContent(arg = {}) {
    dispatch(updateAllChatContentAction({ ...arg }));
  },
  updateHomePageList(arg = {}) {
    dispatch(updateHomePageListAction({ ...arg }));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
