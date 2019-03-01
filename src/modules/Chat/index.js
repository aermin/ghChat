import { clearUnreadAction } from '../../containers/HomePageList/homePageListAction';
import store from '../../redux/store';

export default class Chat {
  scrollToBottom(time = 0) {
    const ulDom = document.getElementsByClassName('chat-content-list')[0];
    if (ulDom) {
      setTimeout(() => {
        ulDom.scrollTop = ulDom.scrollHeight + 10000;
      }, time);
    }
  }

  clearUnreadHandle({ homePageList, chatFromId }) {
    store.dispatch(clearUnreadAction({ homePageList, chatFromId }));
  }

  get isScrollInBottom() {
    const ulDom = document.getElementsByClassName('chat-content-list')[0];
    if (ulDom) {
      return (ulDom.scrollTop + ulDom.clientHeight) === ulDom.scrollHeight;
    }
    return false;
  }
}
