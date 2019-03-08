import { clearUnreadAction } from '../../containers/HomePageList/homePageListAction';
import { addGroupMessagesAction } from '../../containers/GroupChatPage/groupChatAction';
import { addPrivateChatMessagesAction } from '../../containers/PrivateChatPage/privateChatAction';
import store from '../../redux/store';
import notification from '../../components/Notification';

export default class Chat {
  constructor() {
    this._hasLoadAllMessages = false;
  }

  scrollToBottom(time = 0) {
    const ulDom = document.querySelector('.chat-content-list');
    if (ulDom) {
      setTimeout(() => {
        ulDom.scrollTop = ulDom.scrollHeight;
      }, time);
    }
  }

  clearUnreadHandle({ homePageList, chatFromId }) {
    store.dispatch(clearUnreadAction({ homePageList, chatFromId }));
  }

  lazyLoadGroupMessages({
    chats, chatId, start, count
  }) {
    return new Promise((resolve, reject) => {
      if (!this._hasLoadAllMessages) {
        try {
          window.socket.emit('getOneGroupMessages', { groupId: chatId, start, count }, (groupMessages) => {
            if (groupMessages && groupMessages.length === 0) {
              this._hasLoadAllMessages = true;
              notification('已经到底啦', 'warn', 2);
              reject();
            }
            store.dispatch(addGroupMessagesAction({
              allGroupChats: chats, messages: groupMessages, groupId: chatId, inLazyLoading: true
            }));
            resolve();
          });
        } catch (error) {
          console.log(error);
          notification('出错啦，请稍后再试', 'error');
          const errorText = 'try again later';
          reject(errorText);
        }
      }
    });
  }

  lazyLoadPrivateChatMessages({
    chats, user_id, chatId, start, count
  }) {
    return new Promise((resolve, reject) => {
      if (!this._hasLoadAllMessages) {
        window.socket.emit('getOnePrivateChatMessages', {
          user_id, toUser: chatId, start, count
        }, (privateChatMessages) => {
          if (privateChatMessages && privateChatMessages.length === 0) {
            this._hasLoadAllMessages = true;
            notification('已经到底啦', 'warn', 2);
            reject();
          }
          store.dispatch(addPrivateChatMessagesAction({
            allPrivateChats: chats, messages: privateChatMessages, chatId, inLazyLoading: true
          }));
          resolve('success!');
        });
      }
    });
  }

  get isScrollInBottom() {
    const ulDom = document.getElementsByClassName('chat-content-list')[0];
    if (ulDom) {
      const { scrollTop, offsetHeight, scrollHeight } = ulDom;
      return scrollTop === (scrollHeight - offsetHeight);
    }
    return false;
  }
}
