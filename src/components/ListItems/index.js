import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toNormalTime } from '../../utils/transformTime';
import UserAvatar from '../UserAvatar';
import GroupAvatar from '../GroupAvatar';
import './styles.scss';

// eslint-disable-next-line react/prefer-stateless-function
class ListItems extends Component {
  render() {
    const robotChat = (
      <li
        key="-1"
        style={this.props.match.path === '/robot_chat' ? { backgroundColor: '#f5f5f5' } : {}}
      >
        <Link to="/robot_chat">
          <UserAvatar
            name="机器人小R"
            size="46" />
          <div className="content">
            <span className="title robotTitle">
              机器人小R
            </span>
          </div>
        </Link>
      </li>
    );

    const listItems = this.props.dataList && this.props.dataList.map((data, index) => {
      const message = data.message || '暂无消息';
      const chatFromId = data.to_group_id || (data.user_id && data.user_id.toString());
      const isGroupChat = !!data.to_group_id;
      let GroupMembers;
      if (isGroupChat) {
        const chatItem = this.props.allGroupChats && this.props.allGroupChats.get(data.to_group_id);
        GroupMembers = chatItem && chatItem.groupInfo && chatItem.groupInfo.members;
      }
      const { params } = this.props.match;
      const unreadColor = data.to_group_id ? 'groupUnread' : 'privateUnread';
      let unreadCircular;
      switch (data.unread && (data.unread).toString().length) {
        case 2:
          unreadCircular = 'twoDigitsUnread';
          break;
        case 3:
          unreadCircular = 'threeDigitsUnread';
          break;
        default:
          unreadCircular = 'oneDigitUnread';
      }
      return (
        <li
          key={index}
          style={(params.user_id || params.to_group_id) === chatFromId ? { backgroundColor: '#f5f5f5' } : {}}
          onClick={() => this.props.clickItem(chatFromId)}
          value={chatFromId}>
          <Link
            to={isGroupChat
              ? `/group_chat/${data.to_group_id}?name=${data.name}`
              : `/private_chat/${data.user_id}?name=${data.name}`}
        >
            { isGroupChat
              ? <GroupAvatar members={GroupMembers || []} />
              : <UserAvatar src={data.avatar} name={data.name} size="46" showLogo={!!data.github_id} />}
            {!!data.unread && (
            <span className={classnames(unreadColor, unreadCircular)}>
              {data.unread > 99 ? '99+' : data.unread}
            </span>
            )}
            <div className="content">
              <div className="title">
                <p className="name">{data.name}</p>
                <span className="time">{!!data.time && toNormalTime(data.time)}</span>
              </div>
              <div className="message">
                { data.showCallMeTip && <span className="callMe">[有人@我]</span> }
                {message}
              </div>
            </div>
          </Link>
        </li>
      );
    });
    const { showRobot, isSearching } = this.props;
    return (
      <ul className="homePageList">
        {showRobot && !isSearching && robotChat}
        {listItems}
      </ul>
    );
  }
}

export default withRouter(ListItems);

ListItems.propTypes = {
  allGroupChats: PropTypes.instanceOf(Map),
  dataList: PropTypes.array,
  showRobot: PropTypes.bool,
  clickItem: PropTypes.func,
  match: PropTypes.object.isRequired,
  isSearching: PropTypes.bool,
};

ListItems.defaultProps = {
  allGroupChats: new Map(),
  dataList: [],
  showRobot: true,
  clickItem() {},
  isSearching: false
};
