import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';

export default class PrivateChat extends Component {
  constructor() {
    super();
    this._sendByMe = false;
  }

  sendMessage = (value) => {
    if (value.trim() === '') return;
    const { userId, avatar, name } = JSON.parse(localStorage.getItem('userInfo'));
    const {
      allChatContent, chatId, homePageList,
      updateHomePageList, updateAllChatContent, location
    } = this.props;
    const chatItem = allChatContent.privateChat.get(chatId);
    const hasBeFriend = !!chatItem;
    const friendId = parseInt(location.pathname.split('private_chat/')[1]);
    if (!hasBeFriend) {
      window.socket.emit('beFriend', { user_id: userId, from_user: friendId });
    }

    const data = {
      from_user: userId, // 自己的id
      to_user: friendId, // 对方id
      avatar, // 自己的头像
      name,
      message: `${name}: ${value}`, // 消息内容
      time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    window.socket.emit('sendPrivateMsg', data);
    updateAllChatContent({ allChatContent, newChatContent: data, action: 'send' });
    const dataForHomePage = { ...data, name: location.search.split('=')[1] };
    updateHomePageList({ data: dataForHomePage, homePageList, myUserId: userId });
    console.log('sent message', data);
  }

  scrollToBottom(time = 0) {
    const ulDom = document.getElementsByClassName('chat-content-list')[0];
    if (ulDom) {
      setTimeout(() => {
        ulDom.scrollTop = ulDom.scrollHeight + 10000;
      }, time);
    }
  }

  componentDidMount() {
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
    console.log('allChatContent.privateChat', allChatContent.privateChat, chatId);
    if (!allChatContent.privateChat) return null;
    const chatItem = allChatContent.privateChat.get(chatId);
    const messages = chatItem ? chatItem.messages : [];
    return (
      <div className="chat-wrapper">
        <ChatHeader title={location.search.split('=')[1]} />
        <ChatContentList ChatContent={messages} chatId={chatId} />
        <InputArea sendMessage={this.sendMessage} />
      </div>
    );
  }
}

PrivateChat.propTypes = {
  allChatContent: PropTypes.object,
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  updateAllChatContent: PropTypes.func,
  chatId: PropTypes.number
};


PrivateChat.defaultProps = {
  allChatContent: {},
  homePageList: [],
  updateHomePageList: undefined,
  updateAllChatContent: undefined,
  chatId: undefined,
};
