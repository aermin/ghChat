import React, { Component } from 'react';
import '../../assets/chat.scss';
import ChatHeader from '../ChatHeader';
import ChatItem from '../ChatItem';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';

export default class GroupChat extends Component {
  sendMessage = (value) => {
    if (value.trim() === '') return;
    const fromUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    const {
      allChatContent, chatId, homePageList, updateHomePageList, updateAllChatContentBySent
    } = this.props;
    const data = {
      from_user: fromUserInfo.user_id, // 自己的id
      avator: fromUserInfo.avator, // 自己的头像
      name: fromUserInfo.name,
      message: `${fromUserInfo.name}: ${value}`, // 消息内容
      to_group: chatId,
      time: Date.parse(new Date()) / 1000 // 时间
    };
    socket.emit('sendGroupMsg', data);
    console.log('sendGroupMsg success', data);
    updateAllChatContentBySent({ allChatContent, newChatContent: data, chatType: 'groupChat' });
    updateHomePageList({ data, homePageList, myUserId: fromUserInfo.user_id });
  }

  scrollToBottom(time = 0) {
    const ulDom = document.getElementsByClassName('chat-content-list')[0];
    setTimeout(() => {
      ulDom.scrollTop = ulDom.scrollHeight + 10000;
    }, time);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { relatedCurrentChat, chatId } = nextProps;
    if (relatedCurrentChat || chatId !== this.props.chatId) return true;
    return false;
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    console.log('componentDidUpdate in group chat');
    this.scrollToBottom();
  }

  render() {
    const { chatId, allChatContent } = this.props;
    if (!allChatContent.groupChat) return null;
    const { groupMsg, groupInfo } = allChatContent.groupChat.get(chatId);
    const fromUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    return (
      <div className="chat-wrapper">
        <ChatHeader title="群聊天" />
        <ChatContentList ChatContent={groupMsg} chatId={fromUserInfo.user_id} />
        <InputArea sendMessage={this.sendMessage} />
      </div>
    );
  }
}
