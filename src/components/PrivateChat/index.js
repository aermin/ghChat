import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';

export default class PrivateChat extends Component {
    sendMessage = (value) => {
      if (value.trim() === '') return;
      const fromUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const {
        allChatContent, chatId, homePageList, updateHomePageList, updateAllChatContentBySent
      } = this.props;
      const { userInfo } = allChatContent.privateChat.get(chatId);
      const data = {
        from_user: fromUserInfo.user_id, // 自己的id
        to_user: userInfo.user_id, // 对方id
        avator: fromUserInfo.avator, // 自己的头像
        name: fromUserInfo.name,
        message: `${fromUserInfo.name}: ${value}`, // 消息内容
        type: 'private',
        status: '1', // 是否在线 0为不在线 1为在线
        time: Date.parse(new Date()) / 1000 // 时间
      };
      socket.emit('sendPrivateMsg', data);
      updateAllChatContentBySent({ allChatContent, newChatContent: data, chatType: 'privateChat' });
      updateHomePageList({ data, homePageList, myUserId: fromUserInfo.user_id });
      console.log('sent message', data);
    }

    scrollToBottom(time = 0) {
      const ulDom = document.getElementsByClassName('chat-content-list')[0];
      setTimeout(() => {
        ulDom.scrollTop = ulDom.scrollHeight + 10000;
      }, time);
    }

    async componentDidMount() {
      console.log('componentDidMount in privateChat');
      this.scrollToBottom();
    }

    componentWillReceiveProps(nextProps) {
      console.log('componentWillReceiveProps in privateChat', nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
      console.log(nextProps, 'nextProps & this.props', this.props);
      return true;
      const { allChatContent: nextAllChatContent, chatId: nextChatId } = nextProps;
      const { allChatContent: currentAllChatContent, chatId: currentChatId } = this.props;
      if (!nextAllChatContent.privateChat) return false;
      const { privateDetail: nextPrivateDetail } = nextAllChatContent.privateChat.get(nextChatId);
      const { privateDetail: currentPrivateDetail } = currentAllChatContent.privateChat.get(currentChatId);
      console.log('nextLength !== currentLength', nextPrivateDetail.length, currentPrivateDetail.length);
      if (nextPrivateDetail.length !== currentPrivateDetail.length) return true;
      return false;
    }

    componentDidUpdate() {
      console.log('componentDidUpdate in privateChat');
      this.scrollToBottom();
    }

    componentWillUnmount() {
      console.log('componentWillUnmount in privateChat');
    }

    render() {
      const { chatId, allChatContent } = this.props;
      console.log('allChatContent.privateChat', allChatContent.privateChat, chatId);
      if (!allChatContent.privateChat) return null;
      const { privateDetail, userInfo } = allChatContent.privateChat.get(chatId);
      return (
        <div className="chat-wrapper">
          <ChatHeader title={userInfo.name} />
          <ChatContentList ChatContent={privateDetail} chatId={chatId} />
          <InputArea sendMessage={this.sendMessage} />
        </div>
      );
    }
}

PrivateChat.propTypes = {
  allChatContent: PropTypes.object,
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  updateAllChatContentBySent: PropTypes.func,
  chatId: PropTypes.number
};


PrivateChat.defaultProps = {
  allChatContent: {},
  homePageList: [],
  updateHomePageList: undefined,
  updateAllChatContentBySent: undefined,
  chatId: undefined,
};
