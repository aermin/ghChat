import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserAdapter from '../UserAvatar';
import './style.scss';

export default class GroupChatInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupMember: []
    };
  }

  componentDidMount() {
    const groupId = this.props.chatId;
    window.socket.emit('getGroupMember', groupId, (data) => {
      this.setState({ groupMember: data });
    });
  }

  clickMember = (user_id) => {
    this.props.clickMember(user_id);
  }

  GroupMemberRender = groupMember => (
    <ul className="members">
      {groupMember.length > 0 && groupMember.map(e => (
        <li key={e.user_id} className="member" onClick={() => this.clickMember(e.user_id)}>
          <UserAdapter src={e.avatar} name={e.name} isGray={!e.status} showLogo={!!e.github_id} />
          <span className="memberName">{e.name}</span>
        </li>
      ))}
    </ul>
  );

  render() {
    const { groupMember } = this.state;
    const { groupInfo, leaveGroup } = this.props;
    groupMember.sort((a, b) => b.status - a.status);
    return (
      <div className="chat-information">
        <div className="info">
          <p className="noticeTitle">群公告</p>
          <p className="noticeContent">{groupInfo.group_notice}</p>
        </div>
        {this.GroupMemberRender(groupMember)}
        <p className="leave" onClick={leaveGroup}>退出群聊</p>
      </div>
    );
  }


  get userInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }
}

GroupChatInfo.propTypes = {
  leaveGroup: PropTypes.func.isRequired,
  chatId: PropTypes.string.isRequired,
  groupInfo: PropTypes.object,
};


GroupChatInfo.defaultProps = {
  groupInfo: {}
};
