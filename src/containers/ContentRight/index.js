/* eslint-disable react/prop-types */
import React from 'react';
import RobotPage from '../RobotPage';
import WelcomePage from '../WelcomePage';
import GroupChatPage from '../GroupChatPage';
import PrivateChatPage from '../PrivateChatPage';

export default function ContentLeft(props) {
  console.log('ContentLeftprops', props);
  // eslint-disable-next-line react/destructuring-assignment
  const { params, url } = props.match;
  // eslint-disable-next-line radix
  const chatId = parseInt(params.userId) || params.to_group_id;
  return (
  // switch between privateChatPage not componentWillUnmount, switch other Page will componentWillUnmount
    <div className={(url === '/' || url === '/index') ? 'layout-right-mobile' : 'layout-right'}>
      {(url === '/' || url === '/index') && <WelcomePage />}
      {url === '/robot' && <RobotPage />}
      {url.split('group_chat').length > 1 && <GroupChatPage chatId={chatId} />}
      {url.split('private_chat').length > 1 && <PrivateChatPage chatId={chatId} />}
    </div>
  );
}
