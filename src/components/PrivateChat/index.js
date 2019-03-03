import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';
import PersonalInfo from '../PersonalInfo';
import notification from '../Notification';
import Chat from '../../modules/Chat';

export default class PrivateChat extends Component {
  constructor() {
    super();
    this._sendByMe = false;
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this._hasBeenFriend = false;
    this.state = {
      showPersonalInfo: false
    };
    this._chat = new Chat();
  }

  sendMessage = (inputMsg = '', attachments = []) => {
    if (inputMsg.trim() === '' && attachments.length === 0) return;
    const {
      user_id, avatar, name, github_id
    } = this._userInfo;
    const {
      allPrivateChats, homePageList,
      updateHomePageList, addPrivateChatMessages,
    } = this.props;
    const data = {
      from_user: user_id, // 自己的id
      to_user: this.friendId, // 对方id
      avatar, // 自己的头像
      name,
      github_id,
      message: inputMsg === '' ? attachments[0].type : `${name}: ${inputMsg}`, // 消息内容
      attachments, // 附件
      time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    window.socket.emit('sendPrivateMsg', data);
    this._chat.scrollToBottom();
    addPrivateChatMessages({
      allPrivateChats, message: data, chatId: this.friendId
    });
    const dataForHomePage = { ...data, name: location.search.split('=')[1] };
    updateHomePageList({ data: dataForHomePage, homePageList, myUserId: user_id });
  }

  addAsTheContact =() => {
    const {
      allPrivateChats, homePageList,
      updateHomePageList, addPrivateChatInfo,
      chatId,
    } = this.props;
    if (chatId === this._userInfo.user_id) {
      notification('不能添加自己为联系人哦', 'error');
      return;
    }
    window.socket.emit('addAsTheContact', { user_id: this._userInfo.user_id, from_user: this.friendId }, (data) => {
      addPrivateChatInfo({ allPrivateChats, chatId: this.friendId, userInfo: data });
      const dataInHomePageList = {
        ...data,
        to_user: data.user_id,
        message: '添加联系人成功，给我发消息吧:)',
        time: Date.parse(new Date()) / 1000
      };
      updateHomePageList({ data: dataInHomePageList, homePageList });
    });
  }

  _showPersonalInfo(value) {
    this.setState({ showPersonalInfo: value });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { relatedCurrentChat, chatId } = nextProps;
    // console.log('shouldComponentUpdate', relatedCurrentChat, chatId, this.props.chatId, this._sendByMe);
    if (relatedCurrentChat || chatId !== this.props.chatId || this._sendByMe) {
      this._sendByMe = false;
      return true;
    }

    const { showPersonalInfo } = nextState;
    if (showPersonalInfo !== this.state.showPersonalInfo) return true;

    return false;
  }

  render() {
    const { chatId, allPrivateChats, location } = this.props;
    const { showPersonalInfo } = this.state;
    if (!allPrivateChats && !allPrivateChats.size) return null;
    const chatItem = allPrivateChats.get(chatId);
    const messages = chatItem ? chatItem.messages : [];
    const userInfo = chatItem ? chatItem.userInfo : {};
    return (
      <div className="chat-wrapper">
        <ChatHeader
          showPersonalInfo={() => this._showPersonalInfo(true)}
          title={location.search.split('=')[1]}
          chatType="private" />
        <ChatContentList
          chats={allPrivateChats}
          ChatContent={messages}
          chatId={chatId}
          chatType="privateChat"
          clickAvatar={() => this._showPersonalInfo(true)} />
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
  allPrivateChats: PropTypes.instanceOf(Map),
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  addPrivateChatMessages: PropTypes.func,
  addPrivateChatInfo: PropTypes.func,
  chatId: PropTypes.number,
};


PrivateChat.defaultProps = {
  allPrivateChats: new Map(),
  homePageList: [],
  updateHomePageList: undefined,
  addPrivateChatMessages: undefined,
  addPrivateChatInfo: undefined,
  chatId: undefined,
};
