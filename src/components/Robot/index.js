import React, { Component } from 'react';
import '../../assets/chat.scss';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import ChatItem from '../ChatItem';
import InputArea from '../InputArea';

import {
  toNomalTime
} from '../../utils/transformTime';

export default class Robot extends Component {
  constructor() {
    super();
    this.state = {
      time: toNomalTime(Date.parse(new Date()) / 1000),
      inputMsg: '',
      userInfo: {},
    };
  }

  scrollToBottom(time = 0) {
    const ulDom = document.getElementsByClassName('chat-content-list')[0];
    setTimeout(() => {
      ulDom.scrollTop = ulDom.scrollHeight + 10000;
    }, time);
  }

    sendMessage = async (value) => {
      this.setState({
        inputMsg: value
      }, async () => {
        const { insertMsg, getRobotMsg } = this.props;
        const { inputMsg } = this.state;
        insertMsg(
          { message: inputMsg }
        );
        this.scrollToBottom();
        await getRobotMsg(
          { message: inputMsg }
        );
        this.scrollToBottom();
      });
    }

    componentWillMount() {
      console.log('componentWillMount');
      this.setState({
        userInfo: JSON.parse(localStorage.getItem('userInfo'))
      });
    }

    componentDidMount() {
      this.scrollToBottom(200);
    }

    shouldComponentUpdate(nextProps) {
      const { robotState } = this.props;
      if (nextProps.robotState === robotState) {
        return false;
      }
      return true;
    }

    render() {
      const { robotState } = this.props;
      const { time, userInfo } = this.state;
      const robotImg = 'https://user-images.githubusercontent.com/24861316/47977782-fc0aac00-e0f4-11e8-9686-821e2f5342ca.jpeg';
      const listItems = robotState.map((msg, index) => (
        <li key={index}>
          {msg.user && <ChatItem img={robotImg} msg={msg.message} name={msg.user} time={time} />}
          {!msg.user && <ChatItem me img={userInfo.avator} msg={msg.message} name={userInfo.name} time={time} />}
        </li>
      ));
      return (
        <div className="chat-wrapper">
          <ChatHeader title="机器人聊天" />
          <ul className="chat-content-list">
            {listItems}
          </ul>
          <InputArea sendMessage={this.sendMessage} />
        </div>
      );
    }
}

Robot.propTypes = {
  insertMsg: PropTypes.func,
  getRobotMsg: PropTypes.func,
  robotState: PropTypes.array,
};

Robot.defaultProps = {
  insertMsg: undefined,
  getRobotMsg: undefined,
  robotState: [],
};
