import React, {Component} from 'react';
import Robot from '../Robot';
import Welcome from '../Welcome';
import GroupChat from '../GroupChat';
import PrivateChat from '../PrivateChat';

export default function ContentLeft(props){
    console.log('ContentLeftprops', props);
    return (
        <div className = {props.match.url === '/' ? 'layout-right-mobile' : 'layout-right'}>
            {props.match.url === '/' && <Welcome />}
            {props.match.url === '/robot' && <Robot />}
            {props.match.url.split('group_chat').length > 1 && <GroupChat />}
            {props.match.url.split('private_chat').length > 1 && <PrivateChat />}
        </div>  
    );
}
