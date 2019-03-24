import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserAdapter from '../UserAvatar';
import './styles.scss';

export default class GroupChatInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupMember: [],
      onlineNumber: '--'
    };
  }

  componentDidMount() {
    const groupId = this.props.chatId;
    window.socket.emit('getGroupMember', groupId, (data) => {
      data.sort((a, b) => b.status - a.status);
      const onlineMember = data.filter(e => e.status === 1);
      this.setState({
        groupMember: data,
        onlineNumber: onlineMember.length
      });
    });
  }

  _clickMember = (user_id) => {
    this.props.clickMember(user_id);
  }

  _openEditorInfoModal = () => {

  }

  GroupMemberRender = groupMember => (
    <ul className="members">
      {groupMember.length > 0 && groupMember.map(e => (
        <li key={e.user_id} className="member" onClick={() => this._clickMember(e.user_id)}>
          <UserAdapter src={e.avatar} name={e.name} isGray={!e.status} showLogo={!!e.github_id} />
          <span className="memberName">{e.name}</span>
        </li>
      ))}
    </ul>
  );

  render() {
    const { groupMember, onlineNumber } = this.state;
    const { groupInfo, leaveGroup } = this.props;
    return (
      <div className="chatInformation">
        <div className="info">
          <p className="noticeTitle">
            群公告
            <svg onClick={this._openEditorInfoModal} className="icon iconEditor" aria-hidden="true"><use xlinkHref="#icon-editor" /></svg>
          </p>
          <p className="noticeContent">{groupInfo.group_notice}</p>
          <p className="memberTitle">
            {`在线人数: ${onlineNumber}`}
          </p>
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
