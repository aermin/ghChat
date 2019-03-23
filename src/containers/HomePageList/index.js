import { connect } from 'react-redux';
import HomePageList from '../../components/HomePageList';
import {
  showCallMeTipAction,
} from './homePageListAction';

const mapStateToProps = state => ({
  homePageList: state.homePageListState,
  allGroupChats: state.allGroupChatsState,
  allPrivateChats: state.allPrivateChatsState,
});

const mapDispatchToProps = dispatch => ({
  showCallMeTip(arg = {}) {
    dispatch(showCallMeTipAction({ ...arg }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePageList);
