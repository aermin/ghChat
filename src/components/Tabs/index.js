import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setTabShow} from "../../redux/actions/whichShow";
import './style.scss';

class Tabs extends Component {
	constructor(){
		super();
         	this.state = {}
        }

        clickTabOne = () =>{
            this.props.setTabShow(1);
        }
        clickTabTwo = () =>{
            this.props.setTabShow(2);
        }
        clickTabThree = () =>{
            this.props.setTabShow(3);
        }
        clickTabFour = () =>{
            this.props.setTabShow(4);
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
                            <use  xlinkHref={this.props.tabShow === 2 ? "#icon-zhinengfenxi1" : "#icon-zhinenghua"}></use>
                        </svg> 
                    </div>
                    <div className="tab tab-three" onClick = {this.clickTabThree}>
                        <svg className="icon " aria-hidden="true" >
                            <use  xlinkHref={this.props.tabShow === 3 ? "#icon-group_fill" : "#icon-group"}></use>
                        </svg>
                    </div>
                    <div className="tab tab-four" onClick = {this.clickTabFour}>
                        <svg className="icon " aria-hidden="true" >
                            <use  xlinkHref={this.props.tabShow === 4 ? "#icon-myfill" : "#icon-my"}></use>
                        </svg>  
                    </div>
                </div>
            )
       }
}

export default connect(state => ({
    tabShow: state.whichShow.tabShow
  }), {
    setTabShow
  })(Tabs);