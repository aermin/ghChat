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
import PersonalInfo from '../PersonalInfo';

class GroupChat extends Component {
  constructor() {
    super();
    this._sendByMe = false;
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      groupMsgAndInfo: {},
      showGroupChatInfo: false,
      showPersonalInfo: false,
      personalInfo: {},
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
    window.socket.emit('joinGroup', { userId, toGroupId: chatId }, (data) => {
      const { messages, groupInfo } = data;
      const name = groupInfo && groupInfo.name;
      let lastContent;
      if (messages.length > 1) {
        lastContent = { ...messages[messages.length - 1], name };
      } else {
        lastContent = {
          ...data.groupInfo,
          message: '加入群成功，开始聊天吧:)',
          time: Date.parse(new Date()) / 1000
        };
      }
      updateAllChatContent({ allChatContent, newChatContents: data });
      updateHomePageList({ data: lastContent, homePageList });
    }
    );
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
    // (产品设计) 当查找没加过的群，点击去没群内容，请求出群内容，避免不了解而加错群
    if (!chatItem) {
      window.socket.emit('getGroupMsg', { groupId: chatId });
      window.socket.on('getGroupMsgRes', (groupMsgAndInfo) => {
        this.setState({ groupMsgAndInfo });
        console.log('this.state.groupMsgAndInfo', this.state.groupMsgAndInfo);
      });
    }
    this.scrollToBottom();
  }

  componentDidUpdate() {
    console.log('componentDidUpdate in group chat');
    this.scrollToBottom();
  }

  _showPersonalInfo(value) {
    this.setState({ showPersonalInfo: value });
  }

  _clickPersonAvatar = (userId) => {
    console.log('userId', userId);
    const { allChatContent, chatId } = this.props;
    const { members } = allChatContent.groupChat.get(chatId).groupInfo;
    const personalInfo = members.filter(member => member.user_id === userId)[0];
    console.log('personalInfo', personalInfo);
    this.setState({ personalInfo }, () => {
      this._showPersonalInfo(true);
    });
  }

  render() {
    const { chatId, allChatContent } = this.props;
    const {
      groupMsgAndInfo, showGroupChatInfo,
      visible, personalInfo,
      showPersonalInfo
    } = this.state;
    if (!allChatContent.groupChat) return null;
    const chatItem = allChatContent.groupChat.get(chatId);
    const messages = chatItem ? chatItem.messages : groupMsgAndInfo.messages;
    const groupInfo = chatItem ? chatItem.groupInfo : groupMsgAndInfo.groupInfo;
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
          hasConfirm
          cancel={this._showLeaveModal}
         />
        <PersonalInfo
          userInfo={personalInfo}
          hide={() => this._showPersonalInfo(false)}
          modalVisible={chatItem && showPersonalInfo} />
        <ChatContentList
          ChatContent={messages}
          chatId={userId}
          clickAvatar={userId => this._clickPersonAvatar(userId)}
        />
        { showGroupChatInfo && <div onClick={() => this._showGroupChatInfo(false)} className="groupChatInfoMask" />}
        { showGroupChatInfo && (<GroupChatInfo groupInfo={groupInfo} leaveGroup={this._showLeaveModal} chatId={chatId} />)}
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
