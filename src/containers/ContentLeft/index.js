import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withRouter
} from 'react-router-dom';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import HomePageList from '../HomePageList';
import Tabs from '../../components/Tabs';
import SettingPage from '../SettingPage';
import {
  setHomePageListAction,
} from '../HomePageList/homePageListAction';
import { setAllGroupChatsAction } from '../GroupChatPage/groupChatAction';
import { setAllPrivateChatsAction } from '../PrivateChatPage/privateChatAction';
import { initAppAction } from '../../redux/actions/initAppAction';
import notification from '../../components/Notification';

class ContentLeft extends Component {
  constructor(props) {
    super(props);
    this.WEBSITE_ADDRESS = process.env.NODE_ENV === 'production' ? 'https://im.aermin.top' : 'http://localhost:3000';
  }

  componentWillMount() {
    if (!this.props.initAppState) {
      this.init();
    }
  }

  async init() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // force logged in user to log in again to update userInfo in localStorage because I change userId to user_id global
    // TODO: remove this after one week
    if (userInfo.userId) {
      localStorage.removeItem('userInfo');
      this.props.history.push('/login');
    }

    if (userInfo) {
      window.socket = io(`${this.WEBSITE_ADDRESS}?token=${userInfo.token}`);
      window.socket.on('error', (errorMessage) => {
        notification(errorMessage, 'error');
      });
      window.socket.on('reconnect', (attemptNumber) => {
        console.log('reconnect successfully. attemptNumber ==>', attemptNumber);
      });
      window.socket.on('disconnect', (reason) => {
        // window.socket.open();
        console.log('disconnect but socket open it again. disconnect reason ==>', reason);
      });
      window.socket.on('reconnect_error', (error) => {
        console.log('reconnect_error. error ==>', error);
      });
      window.socket.emit('login', userInfo.user_id);
      window.socket.emit('initMessage', userInfo.user_id, (allMessage) => {
        const privateChat = new Map(allMessage.privateChat);
        const groupChat = new Map(allMessage.groupChat);
        this.props.setHomePageList(allMessage.homePageList);
        this.props.setAllPrivateChats({ data: privateChat });
        this.props.setAllGroupChats({ data: groupChat });
        this.props.initApp(true);
      });
    }
  }

  render() {
    const { url } = this.props.match;
    const isGroupChat = /\/group_chat\//.test(url);
    const isPrivateChat = /\/private_chat\//.test(url);
    const urlsOfShowingHomePage = ['/', '/robot_chat'];
    const shouldShowHomePage = urlsOfShowingHomePage.includes(url) || isGroupChat || isPrivateChat;
    return (
      <div className={(url === '/' || url === '/setting') ? 'layout-left' : 'layout-left-mobile'}>
        <Tabs />
        {url === '/setting' && <SettingPage />}
        { shouldShowHomePage && <HomePageList />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  initAppState: state.initAppState,
});

const mapDispatchToProps = dispatch => ({
  setHomePageList(arg) {
    dispatch(setHomePageListAction(arg));
  },
  setAllGroupChats(arg = {}) {
    dispatch(setAllGroupChatsAction({ ...arg }));
  },
  setAllPrivateChats(arg = {}) {
    dispatch(setAllPrivateChatsAction({ ...arg }));
  },
  initApp(arg) {
    dispatch(initAppAction(arg));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContentLeft));


ContentLeft.propTypes = {
  setHomePageList: PropTypes.func.isRequired,
  setAllGroupChats: PropTypes.func.isRequired,
  setAllPrivateChats: PropTypes.func.isRequired,
  initApp: PropTypes.func.isRequired,
  initAppState: PropTypes.bool,
};


ContentLeft.defaultProps = {
  initAppState: false
};
