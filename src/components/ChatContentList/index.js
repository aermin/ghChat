
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Viewer from 'react-viewer';
import ChatItem from '../ChatItem';
import { toNormalTime } from '../../utils/transformTime';
import Chat from '../../modules/Chat';
import './styles.scss';
import sleep from '../../utils/sleep';

export default class ChatContentList extends Component {
  constructor() {
    super();
    this._chat = new Chat();
    this._scrollHeight = 0;
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this._loadingNewMessages = false;
    this._executeNextLoad = true;
    this.state = {
      imageVisible: false,
      imageUrl: null
    };
  }

  componentDidMount() {
    this._chat.scrollToBottom();
  }

  componentWillUpdate() {
    // If It is the bottom of scroll just now, keep it in the bottom.
    if (this._chat.isScrollInBottom) {
      this._chat.scrollToBottom();
    }
  }

  componentDidUpdate(nextProps) {
    if (nextProps.chatId !== this.props.chatId) { // go to another chat
      this._loadingNewMessages = false;
      this._chat = new Chat();
      this._chat.scrollToBottom();
    }
    if (this._scrollHeight && this._loadingNewMessages) {
      this._ulRef.scrollTop = this._ulRef.scrollHeight - this._scrollHeight;
      this._loadingNewMessages = false;
    }
  }

  _lazyLoadMessage = () => {
    this._executeNextLoad = false;
    const {
      chats, chatId, ChatContent, chatType
    } = this.props;
    if (chatType === 'groupChat') {
      this._chat.lazyLoadGroupMessages({
        chats, chatId, start: ChatContent.length + 1, count: 20
      }).then(() => {
        this._executeNextLoad = true;
      }).catch((error) => {
        if (error === 'try again later') {
          sleep(3000).then(() => {
            this._executeNextLoad = true;
          });
        }
      });
    } else if (chatType === 'privateChat') {
      this._chat.lazyLoadPrivateChatMessages({
        chats,
        user_id: this._userInfo.user_id,
        chatId,
        start: ChatContent.length + 1,
        count: 20
      }).then(() => {
        this._executeNextLoad = true;
      }).catch((error) => {
        if (error === 'try again later') {
          sleep(3000).then(() => {
            this._executeNextLoad = true;
          });
        }
      });
    }
    this._loadingNewMessages = true;
  }

  _onScroll = (e) => {
    if (!this._ulRef) return;
    const { scrollTop, scrollHeight, clientHeight } = e && e.target;
    this._scrollHeight = scrollHeight;
    if (scrollTop === 0 && scrollHeight !== clientHeight && this._executeNextLoad) {
      this._lazyLoadMessage();
    }
  }

  clickImage = (imageUrl) => {
    this.setState({ imageUrl, imageVisible: true });
  }

  _closeImageView = () => {
    this.setState({ imageVisible: false });
  }

  render() {
    const { ChatContent, clickAvatar } = this.props;
    const listItems = ChatContent.map((item, index) => {
      let isMe;
      if (item.to_user) { // is private chat
        isMe = this._userInfo && (this._userInfo.user_id === item.from_user);
      } else if (item.to_group_id) { // is group chat
        isMe = this._userInfo && (this._userInfo.user_id === item.from_user);
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
            clickImage={this.clickImage}
            shouldScrollIntoView={!(this._scrollHeight && this._loadingNewMessages) && !this._chat.isScrollInBottom}
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
        <Viewer
          visible={this.state.imageVisible}
          noNavbar
          onClose={this._closeImageView}
          images={[{ src: this.state.imageUrl, alt: '' }]}
        />
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
