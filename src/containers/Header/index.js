import { connect } from 'react-redux';
import {
  withRouter
} from 'react-router-dom';
import { updateHomePageListAction } from '../HomePageList/homePageListAction';
import {
  addGroupMessageAndInfoAction,
} from '../GroupChatPage/groupChatAction';
import Header from '../../components/Header';

const mapStateToProps = state => ({
  allGroupChats: state.allGroupChatsState,
  homePageList: state.homePageListState,
});

const mapDispatchToProps = dispatch => ({
  addGroupMessageAndInfo(arg = {}) {
    dispatch(addGroupMessageAndInfoAction({ ...arg }));
  },
  updateHomePageList(arg = {}) {
    dispatch(updateHomePageListAction({ ...arg }));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
