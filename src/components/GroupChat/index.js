import React, { Component } from 'react';
import {
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';
import GroupChatInfo from '../GroupChatInfo';
import Modal from '../Modal';
import InviteModal from '../InviteModal';
import PersonalInfo from '../PersonalInfo';
import notification from '../Notification';
import Chat from '../../modules/Chat';
import './styles.scss';

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
      showLeaveGroupModal: false,
      showInviteModal: false
    };
    this._chat = new Chat();
    this._didMount = false;
  }

  sendMessage = (inputMsg = '', attachments = []) => {
    if (inputMsg.trim() === '' && attachments.length === 0) return;
    const {
      user_id, avatar, name, github_id
    } = this._userInfo;
    const {
      allGroupChats, homePageList,
      updateHomePageList, addGroupMessages,
    } = this.props;
    const data = {
      from_user: user_id, // 自己的id
      avatar, // 自己的头像
      name,
      github_id,
      groupName: this.groupName,
      message: inputMsg === '' ? `${name}: [${attachments[0].type || 'file'}]` : `${name}: ${inputMsg}`, // 消息内容
      attachments, // 附件
      to_group_id: this.chatId,
      time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    window.socket.emit('sendGroupMsg', data);
    addGroupMessages({ allGroupChats, message: data, groupId: this.chatId });
    updateHomePageList({ data, homePageList, myUserId: user_id });
  }

  joinGroup = () => {
    const {
      allGroupChats, homePageList, updateHomePageList, addGroupMessageAndInfo
    } = this.props;
    window.socket.emit('joinGroup', { userInfo: this._userInfo, toGroupId: this.chatId }, (data) => {
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
        allGroupChats, messages, groupId: this.chatId, groupInfo
      });
      updateHomePageList({ data: lastContent, homePageList });
    }
    );
  }

  _showLeaveModal = () => {
    this.setState(state => ({ showLeaveGroupModal: !state.showLeaveGroupModal }));
  }

  leaveGroup = () => {
    const { user_id } = this._userInfo;
    const {
      homePageList, deleteHomePageList, allGroupChats, deleteGroupChat
    } = this.props;
    window.socket.emit('leaveGroup', { user_id, toGroupId: this.chatId });
    deleteHomePageList({ homePageList, chatId: this.chatId });
    deleteGroupChat({ allGroupChats, groupId: this.chatId });
    this.props.history.push('/');
  }

  _showGroupChatInfo(value) {
    this.setState({ showGroupChatInfo: value });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { relatedCurrentChat, match } = nextProps;
    if (relatedCurrentChat || match.params.to_group_id !== this.chatId || this._sendByMe) {
      this._sendByMe = false;
      return true;
    }

    const { showGroupChatInfo, showPersonalInfo, showLeaveGroupModal } = nextState;
    if (showGroupChatInfo !== this.state.showGroupChatInfo
       || showPersonalInfo !== this.state.showPersonalInfo
       || showLeaveGroupModal !== this.state.showLeaveGroupModal
    ) return true;

    return false;
  }

  _showPersonalInfo(value) {
    this.setState({ showPersonalInfo: value });
  }

  _clickPersonAvatar = (user_id) => {
    const { allGroupChats } = this.props;
    const { members } = allGroupChats.get(this.chatId).groupInfo;
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
      allGroupChats,
    } = this.props;
    const chatItem = allGroupChats && allGroupChats.get(this.chatId);
    // (产品设计) 当查找没加过的群，点击去没群内容，请求出群内容，避免不了解而加错群
    if (!chatItem) {
      window.socket.emit('getOneGroupItem', { groupId: this.chatId, start: 1 }, (groupMsgAndInfo) => {
        this.setState({ groupMsgAndInfo });
      });
    }
    this._didMount = true;
  }

  get chatId() {
    // eslint-disable-next-line react/prop-types
    return this.props.match.params.to_group_id;
  }

  _showInviteModal = () => {
    this.setState(state => ({ showInviteModal: !state.showInviteModal }));
  }

  render() {
    const {
      allGroupChats,
      updateGroupTitleNotice,
      updateListGroupName,
      homePageList,
      inviteDate,
    } = this.props;
    const {
      groupMsgAndInfo, showGroupChatInfo,
      showLeaveGroupModal, personalInfo,
      showPersonalInfo,
      showInviteModal
    } = this.state;
    if (!allGroupChats && !allGroupChats.size) return null;
    const chatItem = allGroupChats.get(this.chatId);
    const messages = chatItem ? chatItem.messages : groupMsgAndInfo.messages;
    const groupInfo = chatItem ? chatItem.groupInfo : groupMsgAndInfo.groupInfo;
    return (
      <div className="chat-wrapper">
        <ChatHeader
          title={groupInfo && groupInfo.name || '----'}
          chatType="group"
          hasShowed={showGroupChatInfo}
          showInviteModal={this._showInviteModal}
          showGroupChatInfo={value => this._showGroupChatInfo(value)}
        />
        <Modal
          title="确定退出此群？"
          visible={showLeaveGroupModal}
          confirm={this.leaveGroup}
          hasCancel
          hasConfirm
          cancel={this._showLeaveModal}
         />
        <InviteModal
          title="分享此群给"
          modalVisible={showInviteModal}
          chatId={this.chatId}
          showInviteModal={this._showInviteModal}
          cancel={this._showInviteModal}
          allGroupChats={allGroupChats}
          homePageList={homePageList}
          clickInviteModalItem={this._chat.clickInviteModalItem}
         />
        <PersonalInfo
          userInfo={personalInfo}
          hide={() => this._showPersonalInfo(false)}
          modalVisible={chatItem && showPersonalInfo} />
        <ChatContentList
          chat={this._chat}
          chats={allGroupChats}
          ChatContent={messages}
          shouldScrollToFetchData={!!chatItem}
          chatId={this.chatId}
          chatType="groupChat"
          clickAvatar={user_id => this._clickPersonAvatar(user_id)}
        />
        { showGroupChatInfo && <div onClick={() => this._showGroupChatInfo(false)} className="groupChatInfoMask" />}
        { showGroupChatInfo && (
        <GroupChatInfo
          groupInfo={groupInfo}
          allGroupChats={allGroupChats}
          homePageList={homePageList}
          leaveGroup={this._showLeaveModal}
          clickMember={user_id => this._clickPersonAvatar(user_id)}
          updateGroupTitleNotice={updateGroupTitleNotice}
          updateListGroupName={updateListGroupName}
          chatId={this.chatId} />
        )}
        { chatItem ? (
          <InputArea
            inviteDate={inviteDate}
            sendMessage={this.sendMessage}
            groupMembers={groupInfo.members} />
        )
          : this._didMount && (
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
  updateGroupTitleNotice: PropTypes.func,
  updateListGroupName: PropTypes.func,
  inviteDate: PropTypes.object,
};


GroupChat.defaultProps = {
  allGroupChats: new Map(),
  homePageList: [],
  updateHomePageList() {},
  addGroupMessages() {},
  addGroupMessageAndInfo() {},
  deleteHomePageList() {},
  deleteGroupChat() {},
  updateGroupTitleNotice() {},
  updateListGroupName() {},
  inviteDate: undefined,
};
