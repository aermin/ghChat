import React, {Component} from 'react';
import HomePageList from '../HomePageList';
import SideBar from '../SideBar';


export default function ContentLeft(props){
    console.log('ContentLeftprops', props);
    return (
        <div className = {props.match.url === '/' ? 'layout-left' : 'layout-left-mobile'}>
            <SideBar />
            <HomePageList />
        </div>  
    );
}
