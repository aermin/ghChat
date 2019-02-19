import React from 'react';
import { Link } from 'react-router-dom';
import { toNormalTime } from '../../utils/transformTime';
import UserAvatar from '../UserAvatar';
import GroupAvatar from '../GroupAvatar';
import './style.scss';

export default function listItems({
  allChatContent, clickItem, dataList
}) {
  const listItems = dataList && dataList.map((data, index) => {
    let message;
    const attachments = (typeof data.attachments === 'string') && JSON.parse(data.attachments);
    if (!data.message && attachments.length > 0) {
      message = `[${attachments[0].type}]`;
    } else {
      message = data.message || '暂无消息';
    }
    const chatFromId = data.to_group_id || data.user_id;
    const isGroupChat = !!data.to_group_id;
    let GroupMembers;
    if (isGroupChat) {
      const chatItem = allChatContent.groupChat && allChatContent.groupChat.get(data.to_group_id);
      GroupMembers = chatItem && chatItem.groupInfo && chatItem.groupInfo.members;
    }
    // console.log('GroupMembers233', GroupMembers);
    return (
      // TODO: use group chat avatar which bases on some member avatar
      <li key={index} onClick={clickItem} value={chatFromId}>
        <Link to={isGroupChat ? `/group_chat/${data.to_group_id}?name=${data.name}` : `/private_chat/${data.user_id}?name=${data.name}`}>
          { isGroupChat
            ? <GroupAvatar members={GroupMembers || []} />
            : <UserAvatar src={data.avatar} name={data.name} size="46" />}
          {!!data.unread && <span className={data.to_group_id ? 'group-unread' : 'private-unread'}>{data.unread}</span>}
          <div className="content">
            <div className="title">
              {data.name}
              <span>{!!data.time && toNormalTime(data.time)}</span>
            </div>
            <div className="message">{message}</div>
          </div>
        </Link>
      </li>
    );
  });

  const robotChat = (
    <li>
      <Link to="/robot_chat">
        <UserAvatar
          src="https://user-images.githubusercontent.com/24861316/47977782-fc0aac00-e0f4-11e8-9686-821e2f5342ca.jpeg"
          name="机器人小R"
          size="46" />
        <div className="content">
          <div className="title">
              机器人小R
          </div>
        </div>
      </Link>
    </li>
  );
  return (
    <ul>
      {robotChat}
      {listItems}
    </ul>
  );
}
