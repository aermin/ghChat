import io from 'socket.io-client';
import store from '../../redux/store';
import {
  updateHomePageListAction,
  relatedCurrentChatAction,
  setHomePageListAction,
  deleteHomePageListAction,
} from '../../containers/HomePageList/homePageListAction';
import {
  addGroupMessagesAction,
  addGroupMessageAndInfoAction,
  setAllGroupChatsAction,
} from '../../containers/GroupChatPage/groupChatAction';
import {
  addPrivateChatMessagesAction,
  addPrivateChatMessageAndInfoAction,
  setAllPrivateChatsAction,
  deletePrivateChatAction,
} from '../../containers/PrivateChatPage/privateChatAction';
import notification from '../../components/Notification';
import BrowserNotification from '../BrowserNotification';
import Chat from '../Chat';
import request from '../../utils/request';

class InitApp {
  constructor(props) {
    this.WEBSITE_ADDRESS = process.env.NODE_ENV === 'production' ? 'https://im.aermin.top' : 'http://localhost:3000';
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this._hasCalledMe = false;
    this._browserNotification = new BrowserNotification();
    this._chat = new Chat();
    this._history = props.history;
  }

  _browserNotificationHandle = (data) => {
    const { homePageListState } = store.getState();
    const { name, message, avatar } = data;
    const chatType = data.to_group_id ? 'group_chat' : 'private_chat';
    const chatFromId = data.to_group_id ? data.to_group_id : data.from_user;
    const title = data.to_group_id && data.groupName ? data.groupName : name;
    const audio = "https://cdn.aermin.top/audio.aac";
    this._browserNotification.notify({
      title,
      text: message,
      icon: avatar,
      audio,
      onClick: () => {
        this._history.push(`/${chatType}/${chatFromId}`);
        window.focus();
        this._chat.clearUnreadHandle({ homePageList: homePageListState, chatFromId });
      }
    });
  }

  _listeningPrivateChatMsg = () => {
    window.socket.on('getPrivateMsg', (data) => {
      const { homePageListState, allPrivateChatsState } = store.getState();
      const { user_id } = this._userInfo;
      // eslint-disable-next-line radix
      const chatId = parseInt(window.location.pathname.split('/').slice(-1)[0]);
      const isRelatedCurrentChat = (data.from_user === chatId || data.to_user === chatId);
      const increaseUnread = isRelatedCurrentChat ? 0 : 1;
      store.dispatch(relatedCurrentChatAction(isRelatedCurrentChat));
      if (!allPrivateChatsState.get(data.from_user) || !allPrivateChatsState.get(data.from_user).userInfo) {
        const userInfo = {
          ...data,
          user_id: data.from_user
        };
        store.dispatch(addPrivateChatMessageAndInfoAction({
          allPrivateChats: allPrivateChatsState, message: data, chatId: data.from_user, userInfo,
        }));
      } else {
        store.dispatch(addPrivateChatMessagesAction({
          allPrivateChats: allPrivateChatsState,
          message: data,
          chatId: data.from_user,
        }));
      }
      store.dispatch(updateHomePageListAction({
        data, homePageList: homePageListState, myUserId: user_id, increaseUnread
      }));
      this._browserNotificationHandle(data);
      // TODO: mute notifications switch
    });
  }

  _listeningGroupChatMsg = () => {
    window.socket.on('getGroupMsg', (data) => {
      const { allGroupChatsState, homePageListState } = store.getState();
      // eslint-disable-next-line radix
      const chatId = window.location.pathname.split('/').slice(-1)[0];
      const isRelatedCurrentChat = (data.to_group_id === chatId);
      store.dispatch(relatedCurrentChatAction(isRelatedCurrentChat));
      if (data.tip === 'joinGroup') {
        store.dispatch(addGroupMessageAndInfoAction({
          allGroupChats: allGroupChatsState,
          groupId: data.to_group_id,
          message: data,
          member: data,
        }));
      } else {
        store.dispatch(addGroupMessagesAction({ allGroupChats: allGroupChatsState, message: data, groupId: data.to_group_id }));
      }
      if (data.message && !this._hasCalledMe) {
        const regexp = new RegExp(`@${this._userInfo.name}\\s\\S*|@${this._userInfo.name}$`);
        this._hasCalledMe = regexp.test(data.message);
      }
      store.dispatch(updateHomePageListAction({
        data,
        homePageList: homePageListState,
        increaseUnread: isRelatedCurrentChat ? 0 : 1,
        showCallMeTip: this._hasCalledMe
      }));
      this._browserNotificationHandle(data);
      // TODO: mute notifications switch
    });
  }

  _listeningBeDelete = () => {
    window.socket.on('beDeleted', (from_user) => {
      const homePageList = store.getState().homePageListState;
      const allPrivateChats = store.getState().allPrivateChats;
      store.dispatch(deleteHomePageListAction({ homePageList, chatId: from_user }));
      store.dispatch(deletePrivateChatAction({ allPrivateChats, chatId: from_user }));
    })
  }

  subscribeSocket() {
    window.socket.removeListener('getPrivateMsg');
    this._listeningPrivateChatMsg();
    window.socket.removeListener('getGroupMsg');
    this._listeningGroupChatMsg();
    window.socket.removeListener('beDeleted');
    this._listeningBeDelete();
    console.log('subscribeSocket success');
  }

  _initSocket = async () => {
    const { token, user_id } = this._userInfo;
    window.socket = io(`${this.WEBSITE_ADDRESS}?token=${token}`);
    const initSocketRes = await request.socketEmitAndGetResponse('initSocket', user_id);
    console.log(`${user_id} connect socket success.`, initSocketRes, 'time=>', new Date().toLocaleString());
    const initGroupChatRes = await request.socketEmitAndGetResponse('initGroupChat', user_id);
    console.log(initGroupChatRes, 'time=>', new Date().toLocaleString());
  };

  _initMessage = async () => {
    const { user_id } = this._userInfo;
    const allMessage = await request.socketEmitAndGetResponse('initMessage', {
      user_id,
      clientHomePageList: JSON.parse(localStorage.getItem(`homePageList-${user_id}`))
    });
    const privateChat = new Map(allMessage.privateChat);
    const groupChat = new Map(allMessage.groupChat);
    store.dispatch(setHomePageListAction(allMessage.homePageList));
    store.dispatch(setAllPrivateChatsAction({ data: privateChat }));
    store.dispatch(setAllGroupChatsAction({ data: groupChat }));
  }

  _init = async () => {
    await this._initSocket();
    this.subscribeSocket();
    await this._initMessage();
  }


  init = async () => {
    if (this._userInfo) {
      await this._init();
      console.log('init app success');
      window.socket.on('error', (error) => {
        notification(error, 'error');
      });
      window.socket.on('reconnect', (attemptNumber) => {
        console.log('reconnect successfully. attemptNumber =>', attemptNumber, 'time=>', new Date().toLocaleString());
      });
      window.socket.on('disconnect', async (reason) => {
        console.log('disconnect in client, disconnect reason =>', reason, 'time=>', new Date().toLocaleString());
        await this._initSocket();
        await this._initMessage();
      });
      window.socket.on('reconnect_error', (error) => {
        console.log('reconnect_error. error =>', error, 'time=>', new Date().toLocaleString());
      });
    }
  }
}

export default InitApp;
