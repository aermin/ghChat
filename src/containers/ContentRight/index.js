/* eslint-disable react/prop-types */
import React from 'react';
import RobotPage from '../RobotPage';
import WelcomePage from '../WelcomePage';
import GroupChatPage from '../GroupChatPage';
import PrivateChatPage from '../PrivateChatPage';

export default function ContentLeft(props) {
  // console.log('ContentLeftprops', props);
  // eslint-disable-next-line react/destructuring-assignment
  const { params, url } = props.match;
  // eslint-disable-next-line radix
  const chatId = parseInt(params.user_id) || params.to_group_id;
  const isGroupChat = /\/group_chat\//.test(url);
  const isPrivateChat = /\/private_chat\//.test(url);
  const urlsOfShowingWelcomePage = ['/', '/setting'];
  const shouldShowWelcomePage = urlsOfShowingWelcomePage.includes(url);
  return (
    <div className={shouldShowWelcomePage ? 'layout-right-mobile' : 'layout-right'}>
      {shouldShowWelcomePage && <WelcomePage />}
      {url === '/robot_chat' && <RobotPage />}
      {isGroupChat && <GroupChatPage chatId={chatId} />}
      {isPrivateChat && <PrivateChatPage chatId={chatId} />}
    </div>
  );
}
