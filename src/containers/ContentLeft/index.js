import React from 'react';
import HomePageList from '../HomePageList';
import Tabs from '../../components/Tabs';
import Header from '../../components/Header';


export default function ContentLeft(props) {
  console.log('ContentLeftprops', props);
  return (
    <div className={props.match.url === '/' ? 'layout-left' : 'layout-left-mobile'}>
      <Header />
      <Tabs />
      <HomePageList />
    </div>
  );
}
