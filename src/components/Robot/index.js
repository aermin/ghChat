import React, { Component } from 'react';
import '../../assets/chat.scss';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import ChatItem from '../ChatItem';
import InputArea from '../InputArea';

import {
  toNormalTime
} from '../../utils/transformTime';

export default class Robot extends Component {
  constructor() {
    super();
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      inputMsg: '',
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
          {
            message: inputMsg,
            user_id: this._userInfo.user_id
          }
        );
        this.scrollToBottom();
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
      const listItems = robotState.map((msg, index) => (
        <li key={index}>
          {msg.user && (
          <ChatItem
            msg={msg.message}
            name={msg.user}
            time={toNormalTime(Date.parse(new Date()) / 1000)} />
          )}
          {!msg.user && (
          <ChatItem
            me
            img={this._userInfo.avatar}
            msg={msg.message}
            name={this._userInfo.name}
            time={toNormalTime(Date.parse(new Date()) / 1000)} />
          )}
        </li>
      ));
      return (
        <div className="chat-wrapper">
          <ChatHeader title="机器人聊天" chatType="robot" />
          <ul className="chat-content-list">
            {listItems}
          </ul>
          <InputArea sendMessage={this.sendMessage} isRobotChat />
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
