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
import notification from '../Notification';
import Chat from '../../modules/Chat';

class GroupChat extends Component {
  constructor(props) {
    super(props);
    this._sendByMe = false;
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      groupMsgAndInfo: {},
      showGroupChatInfo: false,
      showPersonalInfo: false,
      personalInfo: {},
      visible: false,
    };
    this._chat = new Chat();
  }

  sendMessage = (inputMsg = '', attachments = []) => {
    if (inputMsg.trim() === '' && attachments.length === 0) return;
    const {
      user_id, avatar, name, github_id
    } = this._userInfo;
    const {
      allGroupChats, chatId, homePageList,
      updateHomePageList, addGroupMessages,
    } = this.props;
    const data = {
      from_user: user_id, // 自己的id
      avatar, // 自己的头像
      name,
      github_id,
      groupName: this.groupName,
      message: inputMsg === '' ? attachments[0].type : `${name}: ${inputMsg}`, // 消息内容
      attachments, // 附件
      to_group_id: chatId,
      time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    window.socket.emit('sendGroupMsg', data);
    this._chat.scrollToBottom();
    addGroupMessages({ allGroupChats, message: data, groupId: chatId });
    updateHomePageList({ data, homePageList, myUserId: user_id });
  }

  joinGroup = () => {
    const {
      allGroupChats, chatId, homePageList, updateHomePageList, addGroupMessageAndInfo
    } = this.props;
    window.socket.emit('joinGroup', { userInfo: this._userInfo, toGroupId: chatId }, (data) => {
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
      addGroupMessageAndInfo({
        allGroupChats, messages, groupId: chatId, groupInfo
      });
      updateHomePageList({ data: lastContent, homePageList });
    }
    );
  }

  _showLeaveModal = () => {
    this.setState(state => ({ visible: !state.visible }));
  }

  leaveGroup = () => {
    const { user_id } = this._userInfo;
    const {
      chatId, homePageList, deleteHomePageList, allGroupChats, deleteGroupChat
    } = this.props;
    window.socket.emit('leaveGroup', { user_id, toGroupId: chatId });
    deleteHomePageList({ homePageList, chatId });
    deleteGroupChat({ allGroupChats, groupId: chatId });
    this.props.history.push('/');
  }

  _showGroupChatInfo(value) {
    this.setState({ showGroupChatInfo: value });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { relatedCurrentChat, chatId } = nextProps;
    if (relatedCurrentChat || chatId !== this.props.chatId || this._sendByMe) {
      this._sendByMe = false;
      return true;
    }

    const { showGroupChatInfo, showPersonalInfo, visible } = nextState;
    if (showGroupChatInfo !== this.state.showGroupChatInfo
       || showPersonalInfo !== this.state.showPersonalInfo
       || visible !== this.state.visible
    ) return true;

    return false;
  }

  _showPersonalInfo(value) {
    this.setState({ showPersonalInfo: value });
  }

  _clickPersonAvatar = (user_id) => {
    const { allGroupChats, chatId } = this.props;
    const { members } = allGroupChats.get(chatId).groupInfo;
    const personalInfo = members.filter(member => member.user_id === user_id)[0];
    if (!personalInfo) {
      notification('此人已不在群中啦', 'warn', 1.5);
      return;
    }
    this.setState({ personalInfo }, () => {
      this._showPersonalInfo(true);
    });
  }

  componentDidMount() {
    const {
      allGroupChats, chatId
    } = this.props;
    const chatItem = allGroupChats && allGroupChats.get(chatId);
    // (产品设计) 当查找没加过的群，点击去没群内容，请求出群内容，避免不了解而加错群
    if (!chatItem) {
      window.socket.emit('getOneGroupItem', { groupId: chatId, start: 1 }, (groupMsgAndInfo) => {
        this.setState({ groupMsgAndInfo });
      });
    }
  }

  render() {
    const { chatId, allGroupChats } = this.props;
    const {
      groupMsgAndInfo, showGroupChatInfo,
      visible, personalInfo,
      showPersonalInfo
    } = this.state;
    if (!allGroupChats && !allGroupChats.size) return null;
    const chatItem = allGroupChats.get(chatId);
    const messages = chatItem ? chatItem.messages : groupMsgAndInfo.messages;
    const groupInfo = chatItem ? chatItem.groupInfo : groupMsgAndInfo.groupInfo;
    return (
      <div className="chat-wrapper">
        <ChatHeader
          title={groupInfo && groupInfo.name || '----'}
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
          chats={allGroupChats}
          ChatContent={messages}
          chatId={chatId}
          chatType="groupChat"
          clickAvatar={user_id => this._clickPersonAvatar(user_id)}
        />
        { showGroupChatInfo && <div onClick={() => this._showGroupChatInfo(false)} className="groupChatInfoMask" />}
        { showGroupChatInfo && (
        <GroupChatInfo
          groupInfo={groupInfo}
          leaveGroup={this._showLeaveModal}
          clickMember={user_id => this._clickPersonAvatar(user_id)}
          chatId={chatId} />
        )}
        { chatItem ? <InputArea sendMessage={this.sendMessage} groupMembers={groupInfo.members} />
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

export default withRouter(GroupChat);


GroupChat.propTypes = {
  allGroupChats: PropTypes.instanceOf(Map),
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  addGroupMessages: PropTypes.func,
  addGroupMessageAndInfo: PropTypes.func,
  deleteHomePageList: PropTypes.func,
  deleteGroupChat: PropTypes.func,
  chatId: PropTypes.string,
};


GroupChat.defaultProps = {
  allGroupChats: new Map(),
  homePageList: [],
  updateHomePageList() {},
  addGroupMessages() {},
  addGroupMessageAndInfo() {},
  deleteHomePageList() {},
  deleteGroupChat() {},
  chatId: undefined,
};
