
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatItem from '../ChatItem';
import { toNormalTime } from '../../utils/transformTime';
import Chat from '../../modules/Chat';
import './styles.scss';

export default class ChatContentList extends Component {
  constructor() {
    super();
    this._didMount = false;
    this._chat = new Chat();
    this._scrollHeight = 0;
    this._scrollTop = null;
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this._isLazyLoading = false;
  }

  componentDidUpdate() {
    if (this._scrollHeight && this._isLazyLoading) {
      this._ulRef.scrollTop = this._ulRef.scrollHeight - this._scrollHeight;
      this._isLazyLoading = false;
    } else if (!this._isLazyLoading && !this._chat.isScrollInBottom) {
      // when it is not lazy loading and not in scroll top or bottom,
      // keep scroll in original position
      this._ulRef.scrollTop = this._scrollTop;
    }
  }

  _onScroll = (e) => {
    if (!this._ulRef) return;
    const { scrollTop, scrollHeight } = e && e.target;
    this._scrollTop = scrollTop;
    if (scrollTop === 0) {
      this._scrollHeight = scrollHeight;
      const {
        chats, chatId, ChatContent, chatType
      } = this.props;
      if (chatType === 'groupChat') {
        this._chat.lazyLoadGroupMessages({
          chats, chatId, start: ChatContent.length + 1, count: 20
        });
      } else if (chatType === 'privateChat') {
        this._chat.lazyLoadPrivateChatMessages({
          chats,
          userId: this._userInfo.userId,
          chatId,
          start: ChatContent.length + 1,
          count: 20
        });
      }
      this._isLazyLoading = true;
    }
  }

  render() {
    const { ChatContent, clickAvatar } = this.props;
    const listItems = ChatContent.map((item, index) => {
      let isMe;
      if (item.to_user) { // is private chat
        isMe = this._userInfo && (this._userInfo.userId === item.from_user);
      } else if (item.to_group_id) { // is group chat
        isMe = this._userInfo && (this._userInfo.userId === item.from_user);
      }
      let message;
      if (item.message) {
        const beginWithName = /\S.*:\s/.test(item.message);
        message = beginWithName ? item.message.substring(item.name.length + 2) : item.message;
      }
      const time = toNormalTime(item.time);
      // console.log('item.attachments', item.attachments);
      const attachments = item.attachments;
      if (item.tip) {
        return <li className="tip" key={index}>{item.message}</li>;
      }
      return (
        <li key={index}>
          <ChatItem
            me={isMe}
            img={item.avatar}
            msg={message}
            name={item.name}
            time={time}
            github_id={item.github_id}
            clickAvatar={() => clickAvatar(item.from_user)}
            attachments={attachments} />
        </li>
      );
    }
    );
    return (
      <ul
        className="chat-content-list"
        ref={(list) => { this._ulRef = list; }}
        onScroll={this._onScroll}
      >
        {listItems}
      </ul>
    );
  }
}


ChatContentList.propTypes = {
  ChatContent: PropTypes.array,
  chatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  clickAvatar: PropTypes.func,
  chatType: PropTypes.string.isRequired,
  chats: PropTypes.instanceOf(Map),
};


ChatContentList.defaultProps = {
  ChatContent: [],
  chatId: null,
  clickAvatar() {},
  chats: new Map(),
};
