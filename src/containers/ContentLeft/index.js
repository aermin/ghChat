import React from 'react';
import HomePageList from '../HomePageList';
import Tabs from '../../components/Tabs';
import SettingPage from '../../components/Setting';

export default function ContentLeft(props) {
  console.log('ContentLeftprops', props);
  const { url } = props.match;
  const isGroupChat = /\/group_chat\//.test(url);
  const isPrivateChat = /\/private_chat\//.test(url);
  const urlsOfShowingHomePage = ['/index', '/robot'];
  const shouldShowHomePage = urlsOfShowingHomePage.includes(url) || isGroupChat || isPrivateChat;
  return (
    <div className={(url === '/' || url === '/index') ? 'layout-left' : 'layout-left-mobile'}>
      <Tabs />
      {url === '/setting' && <SettingPage />}
      { shouldShowHomePage && <HomePageList />}
    </div>
  );
}
