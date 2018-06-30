import React, {Component} from 'react';
import HomePageList from '../HomePageList';
import Tabs from '../../components/Tabs';
import Header from '../../components/Header';
import './style.scss';
import {connect} from 'react-redux';


class LayoutLeft extends Component {
	constructor(){
		super();

         	this.state = {}
        }

        render() {
            console.log('this.props.whichShow', this.props.whichShow);

            return (
                <div className = {this.props.whichShow.robotShow ? 'layout-left-mobile' : 'layout-left'}>
                    <Header />
                    <Tabs />
                    <HomePageList />
                </div>
            )
       }
}

export default connect(state => ({
    whichShow: state.whichShow
  }))(LayoutLeft);