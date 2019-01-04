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
    const fromUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    const {
      allChatContent, chatId, homePageList, updateHomePageList, updateAllChatContentBySent
    } = this.props;
    const { userInfo } = allChatContent.privateChat.get(chatId);
    const data = {
      from_user: fromUserInfo.user_id, // 自己的id
      to_user: userInfo.user_id, // 对方id
      avator: fromUserInfo.avator, // 自己的头像
      name: fromUserInfo.name,
      message: `${fromUserInfo.name}: ${value}`, // 消息内容
      time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    socket.emit('sendPrivateMsg', data);
    updateAllChatContentBySent({ allChatContent, newChatContent: data, chatType: 'privateChat' });
    updateHomePageList({ data, homePageList, myUserId: fromUserInfo.user_id });
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
    const { chatId, allChatContent } = this.props;
    console.log('allChatContent.privateChat', allChatContent.privateChat, chatId);
    if (!allChatContent.privateChat) return null;
    const { privateDetail, userInfo } = allChatContent.privateChat.get(chatId);
    return (
      <div className="chat-wrapper">
        <ChatHeader title={userInfo.name} />
        <ChatContentList ChatContent={privateDetail} chatId={chatId} />
        <InputArea sendMessage={this.sendMessage} />
      </div>
    );
  }
}

PrivateChat.propTypes = {
  allChatContent: PropTypes.object,
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  updateAllChatContentBySent: PropTypes.func,
  chatId: PropTypes.number
};


PrivateChat.defaultProps = {
  allChatContent: {},
  homePageList: [],
  updateHomePageList: undefined,
  updateAllChatContentBySent: undefined,
  chatId: undefined,
};
