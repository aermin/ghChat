import React from 'react';
import HomePageList from '../HomePageList';
import Tabs from '../../components/Tabs';


export default function ContentLeft(props) {
  console.log('ContentLeftprops', props);
  const { url } = props.match;
  return (
    <div className={(url === '/' || url === '/index') ? 'layout-left' : 'layout-left-mobile'}>
      <Tabs />
      <HomePageList />
    </div>
  );
}
