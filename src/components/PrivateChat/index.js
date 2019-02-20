import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';
import PersonalInfo from '../PersonalInfo';

export default class PrivateChat extends Component {
  constructor() {
    super();
    this._sendByMe = false;
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this._hasBeenFriend = false;
    this.state = {
      showPersonalInfo: false
    };
  }

  sendMessage = (inputMsg = '', attachments = []) => {
    if (inputMsg.trim() === '' && attachments.length === 0) return;
    const { userId, avatar, name } = this._userInfo;
    const {
      allChatContent, homePageList,
      updateHomePageList, updateAllChatContent,
    } = this.props;
    const data = {
      from_user: userId, // 自己的id
      to_user: this.friendId, // 对方id
      avatar, // 自己的头像
      name,
      message: inputMsg === '' ? attachments[0].type : `${name}: ${inputMsg}`, // 消息内容
      attachments, // 附件
      time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    window.socket.emit('sendPrivateMsg', data);
    updateAllChatContent({ allChatContent, newChatContent: data, action: 'send' });
    const dataForHomePage = { ...data, name: location.search.split('=')[1] };
    updateHomePageList({ data: dataForHomePage, homePageList, myUserId: userId });
    console.log('sent message', data);
  }

  addAsTheContact =() => {
    const {
      allChatContent, homePageList,
      updateHomePageList, updateUserInfo,
    } = this.props;
    window.socket.emit('addAsTheContact', { user_id: this._userInfo.userId, from_user: this.friendId }, (data) => {
      updateUserInfo({ allChatContent, userInfo: data });
      const dataInHomePageList = {
        ...data,
        to_user: data.user_id,
        message: '添加联系人成功，给我发消息吧:)',
        time: Date.parse(new Date()) / 1000
      };
      updateHomePageList({ data: dataInHomePageList, homePageList });
    });
  }

  scrollToBottom(time = 0) {
    const ulDom = document.getElementsByClassName('chat-content-list')[0];
    if (ulDom) {
      setTimeout(() => {
        ulDom.scrollTop = ulDom.scrollHeight + 10000;
      }, time);
    }
  }

  _showPersonalInfo(value) {
    this.setState({ showPersonalInfo: value });
  }

  clearUnreadHandle() {
    const { homePageList, clearUnread, chatId } = this.props;
    clearUnread({ homePageList, chatFromId: chatId });
  }

  componentDidMount() {
    this.clearUnreadHandle();
    this.scrollToBottom();
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps in privateChat', nextProps, this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { relatedCurrentChat, chatId } = nextProps;
    console.log('shouldComponentUpdate', relatedCurrentChat, chatId, this.props.chatId, this._sendByMe);
    if (relatedCurrentChat || chatId !== this.props.chatId || this._sendByMe) {
      this._sendByMe = false;
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    console.log('componentDidUpdate in privateChat');
    this.scrollToBottom();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount in privateChat');
  }

  render() {
    const { chatId, allChatContent, location } = this.props;
    const { showPersonalInfo } = this.state;
    console.log('allChatContent.privateChat', allChatContent.privateChat, chatId);
    if (!allChatContent.privateChat) return null;
    const chatItem = allChatContent.privateChat.get(chatId);
    console.log('chatItem23333', chatItem);
    const messages = chatItem ? chatItem.messages : [];
    const userInfo = chatItem ? chatItem.userInfo : {};
    return (
      <div className="chat-wrapper">
        <ChatHeader
          showPersonalInfo={() => this._showPersonalInfo(true)}
          title={location.search.split('=')[1]}
          chatType="private" />
        <ChatContentList ChatContent={messages} chatId={chatId} clickAvatar={() => this._showPersonalInfo(true)} />
        <PersonalInfo
          userInfo={userInfo}
          hide={() => this._showPersonalInfo(false)}
          modalVisible={chatItem && showPersonalInfo} />
        { chatItem ? <InputArea sendMessage={this.sendMessage} />
          : (
            <input
              type="button"
              onClick={this.addAsTheContact}
              className="button"
              value="加为联系人"
              />
          )}
      </div>
    );
  }

  // question: writing as this is ok ?
  get friendId() {
    return parseInt(this.props.location.pathname.split('private_chat/')[1]);
  }
}

PrivateChat.propTypes = {
  allChatContent: PropTypes.object,
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  updateAllChatContent: PropTypes.func,
  updateUserInfo: PropTypes.func,
  chatId: PropTypes.number,
  clearUnread: PropTypes.func.isRequired,
};


PrivateChat.defaultProps = {
  allChatContent: {},
  homePageList: [],
  updateHomePageList: undefined,
  updateAllChatContent: undefined,
  updateUserInfo: undefined,
  chatId: undefined,
};
