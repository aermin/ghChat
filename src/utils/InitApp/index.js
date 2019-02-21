import { connect } from 'react-redux';
import io from 'socket.io-client';
import {
  setHomePageListAction,
} from '../../containers/HomePageList/homePageListAction';
import {
  setAllChatContentAction,
} from '../../redux/actions/chatContentAction';
import { initAppAction } from './initAppAction';
import notification from '../../components/Notification';

class InitApp {
  constructor() {
    this.WEBSITE_ADDRESS = process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'http://localhost:3000';
  }

  fetchHomePageListAllChatContent() {
  // init: fetch HomePageList and AllChatContent;
    window.socket.on('getAllMessage', (data) => {
    // console.log('getAllMessage', data);
      const privateChat = new Map(data.privateChat);
      const groupChat = new Map(data.groupChat);
      // console.log('privateChat, groupChat', privateChat, groupChat);
      this.props.setHomePageList(data.homePageList);
      this.props.setAllChatContentAction({ privateChat, groupChat });
    });
  }

  init() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log('APP.js~~');
    const isLoginUrl = /\/login/.test(window.location.href);
    const isRegisterUrl = /\/register/.test(window.location.href);
    if (userInfo && !isLoginUrl && !isRegisterUrl) {
      window.socket = io(`${this.WEBSITE_ADDRESS}?token=${userInfo.token}`);
      window.socket.on('error', (errorMessage) => {
        notification(errorMessage, 'error');
      });
      this.fetchHomePageListAllChatContent();
      window.socket.emit('login', userInfo.userId);
      window.socket.emit('initMessage', userInfo.userId);
      this.props.initApp(true);
    }
  }
}


const mapStateToProps = state => ({
  allChatContent: state.allChatContentState,
  homePageList: state.homePageListState,
  relatedCurrentChat: state.relatedCurrentChat
});

const mapDispatchToProps = dispatch => ({
  setHomePageList(arg = {}) {
    dispatch(setHomePageListAction({ ...arg }));
  },
  setAllChatContent(arg = {}) {
    dispatch(setAllChatContentAction({ ...arg }));
  },
  initApp(arg) {
    dispatch(initAppAction(arg));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(InitApp);
