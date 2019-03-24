import React, { Component } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import HomePageList from '../../containers/HomePageList';
import Tabs from '../Tabs';
import SettingPage from '../../containers/SettingPage';
import notification from '../Notification';
import BrowserNotification from '../../modules/BrowserNotification';
import Chat from '../../modules/Chat';

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.WEBSITE_ADDRESS = process.env.NODE_ENV === 'production' ? 'https://im.aermin.top' : 'http://localhost:3000';
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this._browserNotification = new BrowserNotification();
    this._chat = new Chat();
    this._hasCalledMe = false;
  }

  componentWillMount() {
    if (!this.props.initializedApp) {
      this.init();
    }
  }

  _browserNotificationHandle = (data) => {
    const { name, message, avatar } = data;
    const chatType = data.to_group_id ? 'group_chat' : 'private_chat';
    const chatFromId = data.to_group_id ? data.to_group_id : data.from_user;
    const title = data.to_group_id && data.groupName ? data.groupName : name;
    this._browserNotification.notify({
      title,
      text: message,
      icon: avatar,
      onClick: () => {
        this.props.history.push(`/${chatType}/${chatFromId}?name=${title}`);
        window.focus();
        this._chat.clearUnreadHandle({ homePageList: this.props.homePageList, chatFromId });
      }
    });
  }

  _listeningPrivateChatMsg = () => {
    window.socket.on('getPrivateMsg', (data) => {
      const { user_id } = this._userInfo;
      const {
        allPrivateChats, homePageList, updateHomePageList,
        addPrivateChatMessages, relatedCurrentChat,
        addPrivateChatMessageAndInfo
      } = this.props;
      // eslint-disable-next-line radix
      const chatId = parseInt(window.location.pathname.split('/').slice(-1)[0]);
      const isRelatedCurrentChat = (data.from_user === chatId || data.to_user === chatId);
      const increaseUnread = isRelatedCurrentChat ? 0 : 1;
      relatedCurrentChat(isRelatedCurrentChat);
      if (!allPrivateChats.get(data.from_user) || !allPrivateChats.get(data.from_user).userInfo) {
        const userInfo = {
          ...data,
          user_id: data.from_user
        };
        addPrivateChatMessageAndInfo({
          allPrivateChats, message: data, chatId: data.from_user, userInfo,
        });
      } else {
        addPrivateChatMessages({
          allPrivateChats,
          message: data,
          chatId: data.from_user,
        });
      }
      updateHomePageList({
        data, homePageList, myUserId: user_id, increaseUnread
      });
      this._browserNotificationHandle(data);
      // TODO: mute notifications switch
    });
  }

  _listeningGroupChatMsg = () => {
    window.socket.on('getGroupMsg', (data) => {
      const {
        allGroupChats, homePageList, updateHomePageList,
        addGroupMessages, relatedCurrentChat, addGroupMessageAndInfo
      } = this.props;
      // eslint-disable-next-line radix
      const chatId = window.location.pathname.split('/').slice(-1)[0];
      const isRelatedCurrentChat = (data.to_group_id === chatId);
      relatedCurrentChat(isRelatedCurrentChat);
      if (data.tip === 'joinGroup') {
        addGroupMessageAndInfo({
          allGroupChats,
          groupId: data.to_group_id,
          message: data,
          member: data,
        });
      } else {
        addGroupMessages({ allGroupChats, message: data, groupId: data.to_group_id });
      }
      if (data.message && !this._hasCalledMe) {
        const regexp = new RegExp(`@${this._userInfo.name}\\s\\S*|@${this._userInfo.name}$`);
        this._hasCalledMe = regexp.test(data.message);
      }
      updateHomePageList({
        data,
        homePageList,
        increaseUnread: isRelatedCurrentChat ? 0 : 1,
        showCallMeTip: this._hasCalledMe
      });
      this._browserNotificationHandle(data);
      // TODO: mute notifications switch
    });
  }

  subscribeSocket() {
    window.socket.removeAllListeners('getPrivateMsg');
    window.socket.removeAllListeners('getGroupMsg');
    this._listeningPrivateChatMsg();
    this._listeningGroupChatMsg();
    console.log('subscribeSocket success');
  }

  _initSocket = () => {
    const { token, user_id } = this._userInfo;
    window.socket = io(`${this.WEBSITE_ADDRESS}?token=${token}`);
    window.socket.emit('initSocket', user_id, (data) => {
      console.log(`${user_id} connect socket success.`, data, 'time=>', new Date().toLocaleString());
    });
    window.socket.emit('initGroupChat', user_id, (res) => {
      console.log(res, 'time=>', new Date().toLocaleString());
    });
  };

  _initMessage = () => {
    const { user_id } = this._userInfo;
    window.socket.emit('initMessage', {
      user_id,
      clientHomePageList: JSON.parse(localStorage.getItem(`homePageList-${user_id}`))
    }, (allMessage) => {
      const privateChat = new Map(allMessage.privateChat);
      const groupChat = new Map(allMessage.groupChat);
      this.props.setHomePageList(allMessage.homePageList);
      this.props.setAllPrivateChats({ data: privateChat });
      this.props.setAllGroupChats({ data: groupChat });
      this.props.initApp(true);
    });
  }

  async init() {
    if (this._userInfo) {
      this._initSocket();
      this._initMessage();
      window.socket.on('error', (errorMessage) => {
        notification(errorMessage, 'error');
      });
      window.socket.on('reconnect', (attemptNumber) => {
        console.log('reconnect successfully. attemptNumber =>', attemptNumber, 'time=>', new Date().toLocaleString());
      });
      window.socket.on('disconnect', (reason) => {
        console.log('disconnect in client, disconnect reason =>', reason, 'time=>', new Date().toLocaleString());
        this._initSocket();
        this.subscribeSocket();
        this._initMessage();
      });
      window.socket.on('reconnect_error', (error) => {
        console.log('reconnect_error. error =>', error, 'time=>', new Date().toLocaleString());
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
        { shouldShowHomePage && <HomePageList subscribeSocket={() => this.subscribeSocket()} />}
      </div>
    );
  }
}

MainView.propTypes = {
  setHomePageList: PropTypes.func.isRequired,
  setAllGroupChats: PropTypes.func.isRequired,
  setAllPrivateChats: PropTypes.func.isRequired,
  initApp: PropTypes.func.isRequired,
  initializedApp: PropTypes.bool,
  updateHomePageList: PropTypes.func,
  addGroupMessages: PropTypes.func,
  addGroupMessageAndInfo: PropTypes.func,
  addPrivateChatMessages: PropTypes.func,
  relatedCurrentChat: PropTypes.func,
  allPrivateChats: PropTypes.instanceOf(Map),
  homePageList: PropTypes.array,
  addPrivateChatMessageAndInfo: PropTypes.func,
  allGroupChats: PropTypes.instanceOf(Map),
};


MainView.defaultProps = {
  initializedApp: false,
  allPrivateChats: new Map(),
  updateHomePageList() {},
  addGroupMessages() {},
  addGroupMessageAndInfo() {},
  addPrivateChatMessages() {},
  relatedCurrentChat() {},
  addPrivateChatMessageAndInfo() {},
  homePageList: [],
  allGroupChats: new Map(),
};
