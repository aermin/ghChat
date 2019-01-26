import React from 'react';
import { Link } from 'react-router-dom';
import { toNormalTime } from '../../utils/transformTime';

export default function listItems(props) {
  const listItems = props.dataList.map((data, index) => (
    <li key={index}>
      <Link to={data.to_group_id ? `/group_chat/${data.to_group_id}` : `/private_chat/${data.user_id}`}>
        <img src={data.avatar} alt={data.to_group_id ? '群头像' : '用户头像'} className="img" />
        {/* {data.unread &&<span className={data.type === 'group' ? "group-unread" :"private-unread" }>{data.unread}</span>} */}
        <div className="content">
          <div className="title">
            {data.name}
            <span>{!!data.time && toNormalTime(data.time)}</span>
          </div>
          <div className="message">{data.message || '暂无消息'}</div>
        </div>
      </Link>
    </li>
  ));
  return <ul>{listItems}</ul>;
}
