import React from 'react';
import HomePageList from '../HomePageList';
import Tabs from '../../components/Tabs';
import Header from '../../components/Header';


export default function ContentLeft(props) {
  console.log('ContentLeftprops', props);
  const { url } = props.match;
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && url === '/') {
    socket.emit('initMessage', userInfo.user_id);
  }
  return (
    <div className={(url === '/' || url === '/index') ? 'layout-left' : 'layout-left-mobile'}>
      <Header />
      <Tabs />
      <HomePageList />
    </div>
  );
}
