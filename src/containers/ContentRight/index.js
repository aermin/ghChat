import React from 'react';
import RobotPage from '../RobotPage';
import WelcomePage from '../WelcomePage';
import GroupChatPage from '../GroupChatPage';
import PrivateChatPage from '../PrivateChatPage';

export default function ContentLeft(props){
    console.log('ContentLeftprops', props);
    const chatId = parseInt(props.match.params.user_id);
    return (
        <div className = {props.match.url === '/' ? 'layout-right-mobile' : 'layout-right'}>
            {props.match.url === '/' && <WelcomePage />}
            {props.match.url === '/robot' && <RobotPage />}
            {props.match.url.split('group_chat').length > 1 && <GroupChatPage />}
            {props.match.url.split('private_chat').length > 1 && <PrivateChatPage chatId = {chatId}/>}
        </div>  
    );
}
