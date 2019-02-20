import React from 'react';
import io from 'socket.io-client';
import getRouter from './router/router';
import './app.scss';


import store from './redux/store';
import { setAllChatContentAction } from './redux/actions/chatContentAction';
import { setHomePageListAction } from './containers/HomePageList/homePageListAction';
import notification from './components/Notification';


const isProduction = process.env.NODE_ENV === 'production';
const WEBSITE_ADDRESS = isProduction ? 'http://localhost:3000' : 'http://localhost:3000';

function fetchHomePageListAllChatContent() {
  // init: fetch HomePageList and AllChatContent;
  window.socket.on('getAllMessage', (data) => {
    // console.log('getAllMessage', data);
    const privateChat = new Map(data.privateChat);
    const groupChat = new Map(data.groupChat);
    // console.log('privateChat, groupChat', privateChat, groupChat);
    store.dispatch(setHomePageListAction(data.homePageList));
    store.dispatch(setAllChatContentAction({ privateChat, groupChat }));
  });
}

function initApp() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  // console.log('APP.js~~');
  const isLoginUrl = /\/login/.test(window.location.href);
  const isRegisterUrl = /\/register/.test(window.location.href);
  if (userInfo && !isLoginUrl && !isRegisterUrl) {
    window.socket = io(`${WEBSITE_ADDRESS}?token=${userInfo.token}`);
    window.socket.on('error', (errorMessage) => {
      notification(errorMessage, 'error');
    });
    fetchHomePageListAllChatContent();
    console.log('initMessage && saveSocketIdByUserId');
    window.socket.emit('login', userInfo.userId);
    window.socket.emit('initMessage', userInfo.userId);
  }
}

export default function App() {
  initApp();
  return (
    <div>
      {getRouter()}
    </div>
  );
}
