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
import {
  setAllChatContentAction,
} from '../../redux/actions/chatContentAction';
import { initAppAction } from '../../utils/InitApp/initAppAction';
import notification from '../../components/Notification';

class ContentLeft extends Component {
  constructor(props) {
    super(props);
    this.WEBSITE_ADDRESS = process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'http://localhost:3000';
  }

  componentWillMount() {
    if (!this.props.initAppState) {
      this.init();
    }
  }

  async init() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      window.socket = io(`${this.WEBSITE_ADDRESS}?token=${userInfo.token}`);
      window.socket.on('error', (errorMessage) => {
        notification(errorMessage, 'error');
      });
      window.socket.emit('login', userInfo.userId);
      window.socket.emit('initMessage', userInfo.userId, (allMessage) => {
        const privateChat = new Map(allMessage.privateChat);
        const groupChat = new Map(allMessage.groupChat);
        this.props.setHomePageList(allMessage.homePageList);
        this.props.setAllChatContent({ privateChat, groupChat });
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
  setAllChatContent(arg = {}) {
    dispatch(setAllChatContentAction({ ...arg }));
  },
  initApp(arg) {
    dispatch(initAppAction(arg));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContentLeft));


ContentLeft.propTypes = {
  setHomePageList: PropTypes.func.isRequired,
  setAllChatContent: PropTypes.func.isRequired,
  initApp: PropTypes.func.isRequired,
  initAppState: PropTypes.bool,
};


ContentLeft.defaultProps = {
  initAppState: false
};
