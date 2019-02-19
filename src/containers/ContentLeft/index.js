import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import HomePageList from '../HomePageList';
import Tabs from '../../components/Tabs';
import SettingPage from '../../components/Setting';

function ContentLeft(props) {
  console.log('ContentLeftprops', props);
  if (!localStorage.getItem('userInfo')) {
    props.history.push('/login');
  }
  const { url } = props.match;
  const isGroupChat = /\/group_chat\//.test(url);
  const isPrivateChat = /\/private_chat\//.test(url);
  const urlsOfShowingHomePage = ['/', '/robot_chat'];
  const shouldShowHomePage = urlsOfShowingHomePage.includes(url) || isGroupChat || isPrivateChat;
  return (
    <div className={(url === '/' || url === '/setting') ? 'layout-left' : 'layout-left-mobile'}>
      <Tabs />
      {url === '/setting' && <SettingPage />}
      { shouldShowHomePage && <HomePageList />}
    </div>
  );
}

export default withRouter(ContentLeft);
