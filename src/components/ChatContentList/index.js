
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatItem from '../ChatItem';
import { toNormalTime } from '../../utils/transformTime';

export default class ChatContentList extends Component {
  constructor() {
    super();
    this.ulDom = React.createRef();
  }

  render() {
    const { ChatContent, chatId } = this.props;
    const listItems = ChatContent.map((item, index) => {
      let isMe;
      if (item.to_user) { // is private chat
        isMe = chatId && (chatId !== item.from_user);
      } else if (item.to_group_id) { // is group chat
        isMe = chatId && (chatId === item.from_user);
      }
      const message = item.message && item.message.split(': ') && item.message.split(': ')[1];
      const time = toNormalTime(item.time);
      console.log('item.attachments', item.attachments);
      const attachments = item.attachments;
      return (
        <li key={index}>
          <ChatItem me={isMe} img={item.avatar} msg={message} name={item.name} time={time} attachments={attachments} />
        </li>
      );
    }
    );
    return (
      <ul className="chat-content-list">
        {listItems}
      </ul>
    );
  }
}


ChatContentList.propTypes = {
  ChatContent: PropTypes.array,
  chatId: PropTypes.number
};


ChatContentList.defaultProps = {
  ChatContent: [],
  chatId: null
};
