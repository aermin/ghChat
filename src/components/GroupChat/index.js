import React, { Component } from 'react';
import {
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../assets/chat.scss';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';
import GroupChatInfo from '../GroupChatInfo';
import Modal from '../Modal';
import './style.scss';

class GroupChat extends Component {
  constructor() {
    super();
    this._sendByMe = false;
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      groupMsgAndInfo: {},
      showGroupChatInfo: false,
      visible: false,
    };
  }

  sendMessage = (inputMsg = '', attachments = []) => {
    if (inputMsg.trim() === '' && attachments.length === 0) return;
    const { userId, avatar, name } = this._userInfo;
    const {
      allChatContent, chatId, homePageList,
      updateHomePageList, updateAllChatContent,
    } = this.props;
    const data = {
      from_user: userId, // 自己的id
      avatar, // 自己的头像
      name,
      groupName: this.groupName,
      message: inputMsg === '' ? attachments[0].type : `${name}: ${inputMsg}`, // 消息内容
      attachments, // 附件
      to_group_id: chatId,
      time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    window.socket.emit('sendGroupMsg', data);
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

  _showLeaveModal = () => {
    this.setState(state => ({ visible: !state.visible }));
  }

  leaveGroup = () => {
    const { userId } = this._userInfo;
    const {
      chatId, homePageList, deleteHomePageList, allChatContent, deleteChatContent
    } = this.props;
    window.socket.emit('leaveGroup', { userId, toGroupId: chatId });
    deleteHomePageList({ homePageList, chatId });
    deleteChatContent({ allChatContent, chatId, chatType: 'groupChat' });
    this.props.history.push('/index');
  }

  _showGroupChatInfo(value) {
    this.setState({ showGroupChatInfo: value });
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
    const chatItem = allChatContent.groupChat && allChatContent.groupChat.get(chatId);
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
    const { chatId, allChatContent } = this.props;
    const { groupMsgAndInfo, showGroupChatInfo, visible } = this.state;
    if (!allChatContent.groupChat) return null;
    const chatItem = allChatContent.groupChat.get(chatId);
    const messages = chatItem ? chatItem.messages : groupMsgAndInfo.messages;
    const { userId } = this._userInfo;
    return (
      <div className="chat-wrapper">
        <ChatHeader
          title={this.groupName}
          chatType="group"
          hasShowed={showGroupChatInfo}
          showGroupChatInfo={value => this._showGroupChatInfo(value)}
        />
        <Modal
          title="确定退出此群？"
          visible={visible}
          confirm={this.leaveGroup}
          hasCancel
          cancel={this._showLeaveModal}
         />
        <ChatContentList
          ChatContent={messages}
          chatId={userId}
        />
        { showGroupChatInfo && <div onClick={() => this._showGroupChatInfo(false)} className="mask" />}
        { showGroupChatInfo && (<GroupChatInfo leaveGroup={this._showLeaveModal} chatId={chatId} />)}
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

  get groupName() {
    const { location } = this.props;
    return location.search.split('name=')[1];
  }
}

export default withRouter(GroupChat);


GroupChat.propTypes = {
  allChatContent: PropTypes.object,
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func.isRequired,
  updateAllChatContent: PropTypes.func.isRequired,
  deleteHomePageList: PropTypes.func.isRequired,
  deleteChatContent: PropTypes.func.isRequired,
  chatId: PropTypes.string
};


GroupChat.defaultProps = {
  allChatContent: {},
  homePageList: [],
  chatId: undefined,
};
