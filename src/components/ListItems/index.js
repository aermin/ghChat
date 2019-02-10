import React from 'react';
import { Link } from 'react-router-dom';
import { toNormalTime } from '../../utils/transformTime';

export default function listItems(props) {
  const clickHandle = () => {
    props.clickItem && props.clickItem();
  };

  const listItems = props.dataList.map((data, index) => {
    let message;
    const attachments = (typeof data.attachments === 'string') && JSON.parse(data.attachments);
    if (!message && attachments.length > 0) {
      message = `[${attachments[0].type}]`;
    } else {
      message = message || '暂无消息';
    }
    return (
      <li key={index} onClick={clickHandle} value={data.to_group_id || data.user_id}>
        <Link to={data.to_group_id ? `/group_chat/${data.to_group_id}?name=${data.name}` : `/private_chat/${data.user_id}?name=${data.name}`}>
          <img src={data.avatar} alt={data.to_group_id ? '群头像' : '用户头像'} className="img" />
          {/* {data.unread &&<span className={data.type === 'group' ? "group-unread" :"private-unread" }>{data.unread}</span>} */}
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
  return <ul>{listItems}</ul>;
}
