import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../assets/chat.scss';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';
import './style.scss';

export default class GroupChat extends Component {
  constructor() {
    super();
    this._sendByMe = false;
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      groupMsgAndInfo: {}
    };
  }

  sendMessage = (value) => {
    if (value.trim() === '') return;
    const { userId, avatar, name } = this._userInfo;
    const {
      allChatContent, chatId, homePageList, updateHomePageList, updateAllChatContent
    } = this.props;
    const data = {
      from_user: userId, // 自己的id
      avatar, // 自己的头像
      name,
      message: `${name}: ${value}`, // 消息内容
      to_group_id: chatId,
      time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    window.socket.emit('sendGroupMsg', data);
    console.log('sendGroupMsg success', data);
    updateAllChatContent({ allChatContent, newChatContent: data, action: 'send' });
    updateHomePageList({ data, homePageList, myUserId: userId });
  }

  scrollToBottom(time = 0) {
    const ulDom = document.getElementsByClassName('chat-content-list')[0];
    if (ulDom) {
      setTimeout(() => {
        ulDom.scrollTop = ulDom.scrollHeight + 10000;
      }, time);
    }
  }

  joinGroup = () => {
    const { userId } = this._userInfo;
    const {
      allChatContent, chatId, homePageList, updateHomePageList, updateAllChatContent
    } = this.props;
    window.socket.emit('joinGroup', { userId, toGroupId: chatId });
    window.socket.on('joinGroupRes', (data) => {
      const { messages, groupInfo } = data;
      const name = groupInfo && groupInfo.name;
      const lastContent = { ...messages[messages.length - 1], name };
      updateAllChatContent({ allChatContent, newChatContents: data });
      updateHomePageList({ data: lastContent, homePageList, myUserId: userId });
    });
  }

  shouldComponentUpdate(nextProps) {
    const { relatedCurrentChat, chatId } = nextProps;
    console.log('shouldComponentUpdate ', relatedCurrentChat, chatId, this.props.chatId, this._sendByMe);
    if (relatedCurrentChat || chatId !== this.props.chatId || this._sendByMe) {
      this._sendByMe = false;
      return true;
    }
    return false;
  }

  componentDidMount() {
    const { allChatContent, chatId } = this.props;
    const chatItem = allChatContent.groupChat.get(chatId);
    if (!chatItem) {
      window.socket.emit('getGroupMsg', { groupId: chatId });
      window.socket.on('getGroupMsgRes', (groupMsgAndInfo) => {
        this.setState({ groupMsgAndInfo });
      });
    }
    this.scrollToBottom();
  }

  componentDidUpdate() {
    console.log('componentDidUpdate in group chat');
    this.scrollToBottom();
  }

  render() {
    const { chatId, allChatContent, location } = this.props;
    const { groupMsgAndInfo } = this.state;
    if (!allChatContent.groupChat) return null;
    const chatItem = allChatContent.groupChat.get(chatId);
    const messages = chatItem ? chatItem.messages : groupMsgAndInfo.messages;
    const { userId } = this._userInfo;
    return (
      <div className="chat-wrapper">
        <ChatHeader title={location.search.split('=')[1]} />
        <ChatContentList ChatContent={messages} chatId={userId} />
        { chatItem ? <InputArea sendMessage={this.sendMessage} />
          : (
            <input
              type="button"
              onClick={this.joinGroup}
              className="button"
              value="加入群聊"
              />
          )}
      </div>
    );
  }
}


GroupChat.propTypes = {
  allChatContent: PropTypes.object,
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  updateAllChatContent: PropTypes.func,
  chatId: PropTypes.string
};


GroupChat.defaultProps = {
  allChatContent: {},
  homePageList: [],
  updateHomePageList: undefined,
  updateAllChatContent: undefined,
  chatId: undefined,
};
