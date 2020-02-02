import React, { Component } from 'react';
import '../../assets/chat.scss';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import ChatItem from '../ChatItem';
import InputArea from '../InputArea';

import { toNormalTime } from '../../utils/transformTime';

export default class Robot extends Component {
  constructor() {
    super();
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      inputMsg: '',
    };
  }

  sendMessage = async value => {
    this.setState(
      {
        inputMsg: value,
      },
      async () => {
        const { insertMsg, getRobotMsg } = this.props;
        const { inputMsg } = this.state;
        insertMsg({ message: inputMsg });
        await getRobotMsg({
          message: inputMsg,
          user_id: this._userInfo.user_id,
        });
      },
    );
  };

  componentDidMount() {
    this.scrollBottomRef.scrollIntoView();
  }

  componentDidUpdate() {
    this.scrollBottomRef.scrollIntoView();
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
            time={toNormalTime(Date.parse(new Date()) / 1000)}
          />
        )}
        {!msg.user && (
          <ChatItem
            me
            img={this._userInfo.avatar}
            msg={msg.message}
            name={this._userInfo.name}
            time={toNormalTime(Date.parse(new Date()) / 1000)}
          />
        )}
      </li>
    ));
    return (
      <div className="chat-wrapper">
        <ChatHeader title="机器人聊天" chatType="robot" />
        <ul className="chat-content-list">
          {listItems}
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={el => {
              this.scrollBottomRef = el;
            }}
          />
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
