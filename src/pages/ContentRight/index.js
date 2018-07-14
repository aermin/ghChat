import React, {Component} from 'react';
import Robot from '../Robot';
import Welcome from '../Welcome';

export default function ContentLeft(props){
    console.log('ContentLeftprops', props);
    return (
        <div className = {props.match.url === '/' ? 'layout-right-mobile' : 'layout-right'}>
            {props.match.url === '/robot' && <Robot />}
            {props.match.url === '/' && <Welcome />}
        </div>  
    );
}
