import React, {Component} from 'react';
import HomePageList from '../HomePageList';
import Tabs from '../../components/Tabs';
import Header from '../../components/Header';
import Robot from '../Robot';
import './style.scss';
import {connect} from 'react-redux';


class Layout extends Component {
	constructor(){
		super();

         	this.state = {}
        }

        render() {
            console.log('this.props.whichShow', this.props.whichShow);

            return (
                <div className = 'layout-wrapper'>
                       <div className = 'layout-left'>
                            <Header />
                            <Tabs />
                            <HomePageList />
                       </div>
                       <div className= 'layout-right'>
                            {this.props.whichShow.robotShow && <Robot />}
                            {this.props.whichShow.noChatShow && <img src="http://ooytyiziz.bkt.clouddn.com/nothing-bg.jpeg" alt=""/>}
                       </div>
                </div>
            )
       }
}

export default connect(state => ({
    whichShow: state.whichShow
  }))(Layout);