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
            console.log("whichShow", this.props.whichShow);
            return (
                <div className = 'layout-wrapper'>
                       <div className = 'layout-left'>
                            <Header />
                            <Tabs />
                            <HomePageList />
                       </div>
                       <div className= 'layout-right'>
                            <Robot />
                       </div>
                </div>
            )
       }
}


export default connect(state => ({
    whichShow: state.whichShow
  }))(Layout);