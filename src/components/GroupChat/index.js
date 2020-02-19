import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';
import GroupChatInfo from '../GroupChatInfo';
import Modal from '../Modal';
import ShareModal from '../ShareModal';
import PersonalInfo from '../PersonalInfo';
import notification from '../Notification';
import Chat from '../../modules/Chat';
import Button from '../Button';
import request from '../../utils/request';
import './styles.scss';
import debounce from '../../utils/debounce';

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
      showShareModal: false,
      disableJoinButton: false,
    };
    this._chat = new Chat();
  }

  sendMessage = async (inputMsg = '', attachments = []) => {
    if (inputMsg.trim() === '' && attachments.length === 0) return;
    const { user_id, avatar, name, github_id } = this._userInfo;
    const { allGroupChats, homePageList, updateHomePageList, addGroupMessages } = this.props;
    const data = {
      from_user: user_id, // 自己的id
      avatar, // 自己的头像
      name,
      github_id,
      groupName: this.groupName,
      message:
        inputMsg === '' ? `${name}: [${attachments[0].type || 'file'}]` : `${name}: ${inputMsg}`, // 消息内容
      attachments, // 附件
      to_group_id: this.chatId,
      // time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    const response = await request.socketEmitAndGetResponse('sendGroupMsg', data, error => {
      notification('信息发送失败', 'error', 2);
    });
    addGroupMessages({ allGroupChats, message: response, groupId: this.chatId });
    updateHomePageList({ data: response, homePageList, myUserId: user_id });
  };

  joinGroup = async () => {
    if (this.state.disableJoinButton) return;
    this.setState({ disableJoinButton: true });
    const { allGroupChats, homePageList, updateHomePageList, addGroupMessageAndInfo } = this.props;
    const response = await request.socketEmitAndGetResponse(
      'joinGroup',
      { userInfo: this._userInfo, toGroupId: this.chatId },
      error => {
        notification('加群失败', 'error', 1.5);
        this.setState({ disableJoinButton: false });
      },
    );
    const { messages, groupInfo } = response;
    const lastContent = {
      name: '群助手',
      message: '您已加群成功，可以开始聊天啦~',
      time: Date.parse(new Date()) / 1000,
    };
    messages.push(lastContent);
    addGroupMessageAndInfo({
      allGroupChats,
      messages,
      groupId: this.chatId,
      groupInfo,
    });
    updateHomePageList({ data: { ...lastContent, ...groupInfo }, homePageList });
  };

  _showLeaveModal = () => {
    this.setState(state => ({ showLeaveGroupModal: !state.showLeaveGroupModal }));
  };

  leaveGroup = () => {
    const { user_id } = this._userInfo;
    const { homePageList, deleteHomePageList, allGroupChats, deleteGroupChat } = this.props;
    window.socket.emit('leaveGroup', { user_id, toGroupId: this.chatId });
    deleteHomePageList({ homePageList, chatId: this.chatId });
    deleteGroupChat({ allGroupChats, groupId: this.chatId });
    this.props.history.push('/');
  };

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
    if (
      showGroupChatInfo !== this.state.showGroupChatInfo ||
      showPersonalInfo !== this.state.showPersonalInfo ||
      showLeaveGroupModal !== this.state.showLeaveGroupModal
    )
      return true;

    return false;
  }

  _showPersonalInfo(value) {
    this.setState({ showPersonalInfo: value });
  }

  _clickPersonAvatar = user_id => {
    const { allGroupChats } = this.props;
    const { members = [] } =
      (allGroupChats.get(this.chatId) && allGroupChats.get(this.chatId).groupInfo) || {};
    const personalInfo = members.filter(member => member.user_id === user_id)[0];
    if (!members.length || !user_id) return;
    if (!personalInfo) {
      notification('此人已不在群中啦', 'warn', 1.5);
      return;
    }
    this.setState({ personalInfo }, () => {
      this._showPersonalInfo(true);
    });
  };

  componentDidMount() {
    const { allGroupChats } = this.props;
    const chatItem = allGroupChats && allGroupChats.get(this.chatId);
    // (产品设计) 当查找没加过的群，点击去没群内容，请求出群内容，避免不了解而后悔加群
    if (!chatItem && window.socket) {
      window.socket.emit('getOneGroupItem', { groupId: this.chatId, start: 1 }, groupMsgAndInfo => {
        this.setState({ groupMsgAndInfo });
      });
    }
  }

  get chatId() {
    // eslint-disable-next-line react/prop-types
    return this.props.match.params.to_group_id;
  }

  _showShareModal = () => {
    this.setState(state => ({ showShareModal: !state.showShareModal }));
  };

  render() {
    const {
      allGroupChats,
      updateGroupTitleNotice,
      updateListGroupName,
      homePageList,
      shareData,
      deleteHomePageList,
      allPrivateChats,
      deletePrivateChat,
      initApp,
    } = this.props;
    const {
      groupMsgAndInfo,
      showGroupChatInfo,
      showLeaveGroupModal,
      personalInfo,
      showPersonalInfo,
      showShareModal,
      disableJoinButton,
    } = this.state;
    if ((!allGroupChats && !allGroupChats.size) || !this.chatId) return null;
    const chatItem = allGroupChats.get(this.chatId);
    const messages = chatItem ? chatItem.messages : groupMsgAndInfo.messages;
    const groupInfo = chatItem ? chatItem.groupInfo : groupMsgAndInfo.groupInfo;
    return (
      <div className="chat-wrapper">
        <ChatHeader
          title={(groupInfo && groupInfo.name) || '----'}
          chatType="group"
          hasShowed={showGroupChatInfo}
          showShareModal={this._showShareModal}
          showGroupChatInfo={value => this._showGroupChatInfo(value)}
          showShareIcon={!!chatItem}
        />
        <Modal
          title="确定退出此群？"
          visible={showLeaveGroupModal}
          confirm={this.leaveGroup}
          hasCancel
          hasConfirm
          cancel={this._showLeaveModal}
        />
        <ShareModal
          title="分享此群给"
          modalVisible={showShareModal}
          chatId={this.chatId}
          showShareModal={this._showShareModal}
          cancel={this._showShareModal}
          allGroupChats={allGroupChats}
          homePageList={homePageList}
        />
        <PersonalInfo
          userInfo={personalInfo}
          hide={() => this._showPersonalInfo(false)}
          homePageList={homePageList}
          allPrivateChats={allPrivateChats}
          deleteHomePageList={deleteHomePageList}
          deletePrivateChat={deletePrivateChat}
          modalVisible={chatItem && showPersonalInfo}
        />
        <ChatContentList
          chat={this._chat}
          chats={allGroupChats}
          ChatContent={messages}
          shouldScrollToFetchData={!!chatItem}
          chatId={this.chatId}
          chatType="groupChat"
          clickAvatar={user_id => this._clickPersonAvatar(user_id)}
        />
        {showGroupChatInfo && (
          <div onClick={() => this._showGroupChatInfo(false)} className="groupChatInfoMask" />
        )}
        {showGroupChatInfo && (
          <GroupChatInfo
            groupInfo={groupInfo}
            allGroupChats={allGroupChats}
            homePageList={homePageList}
            leaveGroup={this._showLeaveModal}
            clickMember={user_id => this._clickPersonAvatar(user_id)}
            updateGroupTitleNotice={updateGroupTitleNotice}
            updateListGroupName={updateListGroupName}
            chatId={this.chatId}
          />
        )}
        {chatItem ? (
          <InputArea
            shareData={shareData}
            sendMessage={this.sendMessage}
            groupMembers={groupInfo.members}
          />
        ) : (
          initApp && (
            <Button
              clickFn={debounce(this.joinGroup, 2000, true)}
              value="加入群聊"
              disable={disableJoinButton}
              className="button"
            />
          )
        )}
      </div>
    );
  }
}

export default withRouter(GroupChat);

GroupChat.propTypes = {
  allGroupChats: PropTypes.instanceOf(Map),
  allPrivateChats: PropTypes.instanceOf(Map),
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  addGroupMessages: PropTypes.func,
  addGroupMessageAndInfo: PropTypes.func,
  deleteHomePageList: PropTypes.func,
  deleteGroupChat: PropTypes.func,
  updateGroupTitleNotice: PropTypes.func,
  updateListGroupName: PropTypes.func,
  shareData: PropTypes.object,
  deletePrivateChat: PropTypes.func,
  initApp: PropTypes.bool,
};

GroupChat.defaultProps = {
  allGroupChats: new Map(),
  allPrivateChats: new Map(),
  homePageList: [],
  updateHomePageList() {},
  addGroupMessages() {},
  addGroupMessageAndInfo() {},
  deleteHomePageList() {},
  deleteGroupChat() {},
  updateGroupTitleNotice() {},
  updateListGroupName() {},
  shareData: undefined,
  deletePrivateChat() {},
  initApp: false,
};
