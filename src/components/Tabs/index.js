import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setTabShow,setRobotShow,setNoChatShow} from "../../redux/actions/whichShow";
import './style.scss';

class Tabs extends Component {
	constructor(){
		super();
         	this.state = {}
        }

        clickTabOne = () =>{
            this.props.setTabShow(1);
            this.props.setRobotShow(false);
            this.props.setNoChatShow(true);
        }
        clickTabTwo = () =>{
            this.props.setTabShow(2);
            this.props.setRobotShow(false);
            this.props.setNoChatShow(true);
        }
        clickTabThree = () =>{
            this.props.setTabShow(3);
            this.props.setNoChatShow(false);
            this.props.setRobotShow(true);
        }
        

        render() {
            return (
                <div className="tabs-wrapper">
                    <div className="tab tab-one" onClick = {this.clickTabOne}>
                        <svg className="icon " aria-hidden="true" >
                            <use  xlinkHref={this.props.tabShow === 1 ? "#icon-messagefill" : "#icon-message1"}></use>
                        </svg> 
                    </div>
                    <div className="tab tab-two" onClick = {this.clickTabTwo}>
                        <svg className="icon " aria-hidden="true" >
                            <use  xlinkHref={this.props.tabShow === 2 ? "#icon-group_fill" : "#icon-group"}></use>
                        </svg> 
                    </div>
                    <div className="tab tab-three" onClick = {this.clickTabThree}>
                        <svg className="icon " aria-hidden="true" >
                            <use  xlinkHref={this.props.tabShow === 3 ? "#icon-zhinengfenxi1" : "#icon-zhinenghua" }></use>
                        </svg>
                    </div>
                </div>
            )
       }
}

export default connect(state => ({
    tabShow: state.whichShow.tabShow
  }), {
    setTabShow,
    setRobotShow,
    setNoChatShow
  })(Tabs);