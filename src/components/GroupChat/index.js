import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../assets/chat.scss';
import ChatHeader from '../ChatHeader';
import ChatItem from '../ChatItem';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';

export default class GroupChat extends Component {
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
    const data = {
      from_user: fromUserInfo.user_id, // 自己的id
      avator: fromUserInfo.avator, // 自己的头像
      name: fromUserInfo.name,
      message: `${fromUserInfo.name}: ${value}`, // 消息内容
      to_group: chatId,
      time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    socket.emit('sendGroupMsg', data);
    console.log('sendGroupMsg success', data);
    updateAllChatContentBySent({ allChatContent, newChatContent: data, chatType: 'groupChat' });
    updateHomePageList({ data, homePageList, myUserId: fromUserInfo.user_id });
  }

  scrollToBottom(time = 0) {
    const ulDom = document.getElementsByClassName('chat-content-list')[0];
    if (ulDom) {
      setTimeout(() => {
        ulDom.scrollTop = ulDom.scrollHeight + 10000;
      }, time);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { relatedCurrentChat, chatId } = nextProps;
    console.log('shouldComponentUpdate ', relatedCurrentChat, chatId, this.props.chatId, this._sendByMe);
    if (relatedCurrentChat || chatId !== this.props.chatId || this._sendByMe) {
      this._sendByMe = false;
      return true;
    }
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
        <ChatHeader title={groupInfo[0].group_name} />
        <ChatContentList ChatContent={groupMsg} chatId={fromUserInfo.user_id} />
        <InputArea sendMessage={this.sendMessage} />
      </div>
    );
  }
}


GroupChat.propTypes = {
  allChatContent: PropTypes.object,
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  updateAllChatContentBySent: PropTypes.func,
  chatId: PropTypes.string
};


GroupChat.defaultProps = {
  allChatContent: {},
  homePageList: [],
  updateHomePageList: undefined,
  updateAllChatContentBySent: undefined,
  chatId: undefined,
};
