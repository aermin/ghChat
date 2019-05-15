import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';
import PersonalInfo from '../PersonalInfo';
import notification from '../Notification';
import '../../assets/chat.scss';
import InviteModal from '../InviteModal';
import Chat from '../../modules/Chat';

export default class PrivateChat extends Component {
  constructor() {
    super();
    this._sendByMe = false;
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this._hasBeenFriend = false;
    this._chat = new Chat();
    this.state = {
      showPersonalInfo: false,
      showInviteModal: false,
      toUserInfo: {}
    };
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
      message: inputMsg === '' ? `${name}: [${attachments[0].type || 'file'}]` : `${name}: ${inputMsg}`, // 消息内容
      attachments, // 附件
      time: Date.parse(new Date()) / 1000 // 时间
    };
    this._sendByMe = true;
    window.socket.emit('sendPrivateMsg', data);
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
    } = this.props;
    if (this.chatId === this._userInfo.user_id) {
      notification('不能添加自己为联系人哦', 'error', 2);
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
    const { relatedCurrentChat, match } = nextProps;
    // console.log('shouldComponentUpdate', relatedCurrentChat, chatId, this.props.chatId, this._sendByMe);
    if (relatedCurrentChat || match.params.user_id !== this.chatId || this._sendByMe) {
      this._sendByMe = false;
      return true;
    }

    const { showPersonalInfo } = nextState;
    if (showPersonalInfo !== this.state.showPersonalInfo) return true;

    return false;
  }

  _showInviteModal = () => {
    this.setState(state => ({ showInviteModal: !state.showInviteModal }));
  }

  _deletePrivateChat = () => {
    const { deletePrivateChat, allPrivateChats } = this.props;
    deletePrivateChat({ allPrivateChats, chatId: this.chatId })
  }
  
  _deleteHomePageList = () => {
    const { deleteHomePageList, homePageList } = this.props;
    deleteHomePageList({ homePageList, chatId: this.chatId });
  }

  componentDidMount() {
    const {
      allPrivateChats,
    } = this.props;
    const chatItem = allPrivateChats && allPrivateChats.get(this.chatId);
    if (!chatItem) {
      window.socket.emit('getUserInfo', this.chatId, (toUserInfo) => {
        this.setState({ toUserInfo });
      });
    }
  }

  render() {
    const {
      allPrivateChats, location, inviteData,
      homePageList, allGroupChats, deleteHomePageList,
      deletePrivateChat, initApp
    } = this.props;
    const { showPersonalInfo, showInviteModal, toUserInfo } = this.state;
    if (!allPrivateChats && !allPrivateChats.size) return null;
    const chatItem = allPrivateChats.get(this.chatId);
    const messages = chatItem ? chatItem.messages : [];
    const userInfo = chatItem ? chatItem.userInfo : toUserInfo;
    return (
      <div className="chat-wrapper">
        <InviteModal
          title="分享此联系人给"
          modalVisible={showInviteModal}
          chatId={this.chatId}
          showInviteModal={this._showInviteModal}
          cancel={this._showInviteModal}
          allGroupChats={allGroupChats}
          homePageList={homePageList}
          clickInviteModalItem={this._chat.clickInviteModalItem}
         />
        <ChatHeader
          showPersonalInfo={() => this._showPersonalInfo(true)}
          title={userInfo && userInfo.name || '----'}
          showInviteModal={this._showInviteModal}
          chatType="private"
          showShareIcon={!!chatItem}
        />
        <ChatContentList
          chat={this._chat}
          chats={allPrivateChats}
          ChatContent={messages}
          chatId={this.chatId}
          chatType="privateChat"
          clickAvatar={() => this._showPersonalInfo(true)} />
        <PersonalInfo
          userInfo={userInfo}
          hide={() => this._showPersonalInfo(false)}
          modalVisible={showPersonalInfo} 
          homePageList={homePageList}
          allPrivateChats={allPrivateChats}
          deleteHomePageList={deleteHomePageList}
          deletePrivateChat={deletePrivateChat}
        />
        { chatItem ? (
          <InputArea
            inviteData={inviteData}
            sendMessage={this.sendMessage} />
        )
          : initApp && (
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

  get chatId() {
    return parseInt(this.props.match.params.user_id);
  }

  // question: writing as this is ok ?
  get friendId() {
    return parseInt(this.props.location.pathname.split('private_chat/')[1]);
  }
}

PrivateChat.propTypes = {
  allPrivateChats: PropTypes.instanceOf(Map),
  allGroupChats: PropTypes.instanceOf(Map),
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  addPrivateChatMessages: PropTypes.func,
  addPrivateChatInfo: PropTypes.func,
  inviteData: PropTypes.object,
  deleteHomePageList: PropTypes.func,
  deletePrivateChat: PropTypes.func,
  initApp: PropTypes.bool,
};


PrivateChat.defaultProps = {
  allPrivateChats: new Map(),
  allGroupChats: new Map(),
  homePageList: [],
  updateHomePageList: undefined,
  addPrivateChatMessages: undefined,
  addPrivateChatInfo: undefined,
  inviteData: undefined,
  deleteHomePageList() {},
  deletePrivateChat() {},
  initApp: false,
};
