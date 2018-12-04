import React, { Component } from 'react';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';

export default class PrivateChat extends Component {
  constructor() {
    super();
    this.state = {
      inputMsg: '',
      privateDetail: [], // 私聊相关
      toUserInfo: {},
      isMyFriend: false, // 他是否是我的好友
      isHisFriend: false, // 我是否是他的好友
      fromUserInfo: {}, // 用户自己
      btnInfo: '发送'
    };
  }

    sendMessage = (value) => {
      if (value.trim() == '') return;
      const { toUserInfo, fromUserInfo } = this.state;
      const data = {
        from_user: fromUserInfo.user_id, // 自己的id
        to_user: toUserInfo.user_id, // 对方id
        avator: fromUserInfo.avator, // 自己的头像
        name: fromUserInfo.name,
        message: `${fromUserInfo.name}: ${value}`, // 消息内容
        type: 'private',
        status: '1', // 是否在线 0为不在线 1为在线
        time: Date.parse(new Date()) / 1000 // 时间
      };
      socket.emit('sendPrivateMsg', data);
      // 存此条私聊信息到本地
      const { allChatContent, homePageList } = this.props;
      this.setState((state) => {
        console.log('我在sendMessage setState了');
        return ({
          privateDetail: [...state.privateDetail, data]
        });
      }, () => {
        this.scrollToBottom();
        // push in allChatContent
        this.props.updateHomePageList({ data, homePageList, myUserId: fromUserInfo.user_id });
        this.props.updateAllChatContentBySent({ allChatContent, newChatContent: data, chatType: 'privateChat' });
      });
    }

    // 获取socket消息
    getMsgOnSocket() {
      socket.removeAllListeners('getPrivateMsg'); // make sure there is just one listener of getPrivateMsg
      socket.on('getPrivateMsg', (data) => {
        console.log('getMsgOnSocket', data);
        const { user_id } = this.state.fromUserInfo;
        const { allChatContent, chatId, homePageList } = this.props;
        this.props.updateHomePageList({ data, homePageList, myUserId: user_id });
        // TODO: judge chatType from group and private
        // push in allChatContent
        this.props.updateAllChatContentByGot({ allChatContent, newChatContent: data, chatType: 'privateChat' });
        console.log(data.from_user, 'data.from_user === chatId', chatId);
        if (data.from_user !== chatId) { // not current user's message
          console.log('not current user message');
          return;
        }
        this.scrollToBottom();
        this.setState((state) => {
          console.log('我在getMsgOnSocket setState了', state.privateDetail);
          return ({
            privateDetail: state.privateDetail
          });
        }, () => {
          this.scrollToBottom();
        });
      });
    }

    async setChatContent({ allChatContent, chatId }) {
      const { privateChat } = allChatContent; // privateChat is a Map
      if (!privateChat) return;
      const { privateDetail, userInfo } = privateChat.get(chatId);
      console.log('setChatContent in privateChat', privateDetail);
      await this.setState({
        toUserInfo: userInfo,
        privateDetail
      });
      console.log('我在setChatContent setState了');
    }

    scrollToBottom(time = 0) {
      const ulDom = document.getElementsByClassName('chat-content-list')[0];
      setTimeout(() => {
        ulDom.scrollTop = ulDom.scrollHeight + 10000;
      }, time);
    }

    async componentDidMount() {
      console.log('componentDidMount in privateChat');
      const fromUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      await this.setState({ fromUserInfo });
      const { allChatContent, chatId } = this.props;
      await this.setChatContent({ allChatContent, chatId });
      this.getMsgOnSocket();
    }

    componentWillReceiveProps(nextProps) {
      console.log('componentWillReceiveProps in privateChat', nextProps);
      const { allChatContent, chatId } = nextProps;
      this.setChatContent({ allChatContent, chatId });
      this.scrollToBottom(200);
      // this.getMsgOnSocket();
    }

    componentDidUpdate() {
      console.log('componentDidUpdate in privateChat');
      this.scrollToBottom();
    }

    componentWillUnmount() {
      console.log('componentWillUnmount in privateChat');
    }

    render() {
      const { chatId } = this.props;
      return (
        <div className="chat-wrapper">
          <ChatHeader title={this.state.toUserInfo.name} />
          <ChatContentList ChatContent={this.state.privateDetail} chatId={chatId} />
          <InputArea sendMessage={this.sendMessage} />
        </div>
      );
    }
}
