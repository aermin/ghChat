import React, { Component } from 'react';
import '../../assets/chat.scss';
import ChatHeader from '../ChatHeader';
import ChatItem from '../ChatItem';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';

export default class GroupChat extends Component {
  constructor() {
    super();
    this.state = {
      inputMsg: '',
      groupMsg: [],
      groupInfo: {},
      fromUserInfo: JSON.parse(localStorage.getItem('userInfo')), // 用户自己
      btnInfo: '发送'
    };
  }

  getMsgOnSocket() {
    socket.removeAllListeners('getGroupMsg'); // make sure there is just one listener of getGroupMsg
    socket.on('getGroupMsg', (data) => {
      console.log('getGroupMsg', data);
      // const { fromUserInfo } = this.state;
      // const {
      //   allChatContent, chatId, homePageList, updateHomePageList, updateAllChatContentByGot
      // } = this.props;
      // updateHomePageList({ data, homePageList, myUserId: fromUserInfo.user_id });
      // // TODO: judge chatType from group and private
      // // push in allChatContent
      // updateAllChatContentByGot({ allChatContent, newChatContent: data, chatType: 'privateChat' });
      // console.log(data.from_user, 'data.from_user === chatId', chatId);
      // if (data.from_user !== chatId) { // not current user's message
      //   console.log('not current user\'s message');
      //   return;
      // }
      // this.scrollToBottom();
      // this.setState((state) => {
      //   console.log('我在getMsgOnSocket setState了', state.privateDetail);
      //   return ({
      //     privateDetail: state.privateDetail
      //   });
      // }, () => {
      //   this.scrollToBottom();
      // });
    });
  }

  sendMessage = (value) => {
    if (value.trim() === '') return;
    const { toUserInfo, fromUserInfo } = this.state;
    const {
      allChatContent, chatId, homePageList, updateHomePageList, updateAllChatContentBySent
    } = this.props;
    const data = {
      from_user: fromUserInfo.user_id, // 自己的id
      avator: fromUserInfo.avator, // 自己的头像
      name: fromUserInfo.name,
      message: `${fromUserInfo.name}: ${value}`, // 消息内容
      to_group: chatId,
      time: Date.parse(new Date()) / 1000 // 时间
    };
    socket.emit('sendGroupMsg', data);
    console.log('sendGroupMsg success', data);
    // 存此条私聊信息到本地
    this.setState((state) => {
      console.log('我在sendMessage setState了');
      return ({
        privateDetail: [...state.privateDetail, data]
      });
    }, () => {
      this.scrollToBottom();
      // push in allChatContent
      updateHomePageList({ data, homePageList, myUserId: fromUserInfo.user_id });
      updateAllChatContentBySent({ allChatContent, newChatContent: data, chatType: 'privateChat' });
    });
  }

  async setChatContent({ allChatContent, chatId }) {
    const { groupChat } = allChatContent; // privateChat is a Map
    if (!groupChat) return;
    const { groupMsg, groupInfo } = groupChat.get(chatId);
    console.log('setChatContent in privateChat', groupMsg);
    await this.setState({ groupInfo, groupMsg });
    console.log('我在setChatContent setState了');
  }

  async componentDidMount() {
    console.log('componentDidMount in groupChat', this.props);
    const { allChatContent, chatId } = this.props;
    await this.setChatContent({ allChatContent, chatId });
    this.getMsgOnSocket();
  }

  render() {
    const { groupMsg, fromUserInfo } = this.state;
    console.log(fromUserInfo, 'groupMsg', groupMsg);
    return (
      <div className="chat-wrapper">
        <ChatHeader title="群聊天" />
        <ChatContentList ChatContent={groupMsg} chatId={fromUserInfo.user_id} />
        <InputArea sendMessage={this.sendMessage} />
      </div>
    );
  }
}

// export default connect(state => ({
//     robotMsg: state.robot.robotMsg
//   }), {
//     getRobotMsg,
//     insertUserMsg
//   })(GroupChat);
