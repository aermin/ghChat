import { connect } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import { updateHomePageListAction } from '../HomePageList/homePageListAction';
import { updateAllChatContentAction } from '../../redux/actions/chatContentAction';
import PrivateChat from '../../components/PrivateChat';
import '../../assets/chat.scss';

const mapStateToProps = state => ({
  allChatContent: state.allChatContentState,
  homePageList: state.homePageListState,
  relatedCurrentChat: state.relatedCurrentChat
});

const mapDispatchToProps = dispatch => ({
  updateAllChatContent(arg = {}) {
    dispatch(updateAllChatContentAction({ ...arg }));
  },
  updateHomePageList(arg = {}) {
    dispatch(updateHomePageListAction({ ...arg }));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateChat));
