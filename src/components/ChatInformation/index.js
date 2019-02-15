import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

export default class ChatInformation extends Component {
  render() {
    const groupNotice = 'test';
    return (
      <div className="chat-information">
        <div className="info">
          <p>群公告</p>
          <p>{groupNotice}</p>
          <p>群员 3/100</p>
        </div>
        {/* <div className="member" /> */}
        <input type="button" value="退出群聊" className="leave" onClick={this.props.leaveGroup} />
      </div>
    );
  }


  get userInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }
}

ChatInformation.propTypes = {
  leaveGroup: PropTypes.func.isRequired
};


ChatInformation.defaultProps = {
};
