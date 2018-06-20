import React, {Component} from 'react';

class Tabs extends Component {
	constructor(){
		super();

         	this.state = {}
        }

        clickTabOne = () =>{
            this.props.setCurrentTab(1);
        }
        clickTabTwo = () =>{
            this.props.setCurrentTab(2);
        }
        clickTabThree = () =>{
            this.props.setCurrentTab(3);
        }
        clickTabFour = () =>{
            this.props.setCurrentTab(4);
        }
        
        render() {
            return (
                <div className="tabs-wrapper">
                    <div className="tab-one" onClick = {this.clickTabOne}>
                        <svg className="icon " aria-hidden="true" >
                            <use  xlinkHref={this.props.currentTab === 1 ? "#icon-messagefill" : "#icon-message1"}></use>
                        </svg> 
                    </div>
                    <div className="tab-two" onClick = {this.clickTabTwo}>
                        <svg className="icon " aria-hidden="true" >
                            <use  xlinkHref={this.props.currentTab === 2 ? "#icon-zhinengfenxi1" : "#icon-zhinenghua"}></use>
                        </svg> 
                    </div>
                    <div className="tab-three" onClick = {this.clickTabThree}>
                        <svg className="icon " aria-hidden="true" >
                            <use  xlinkHref={this.props.currentTab === 3 ? "#icon-group_fill" : "#icon-group"}></use>
                        </svg>
                    </div>
                    <div className="tab-four" onClick = {this.clickTabFour}>
                        <svg className="icon " aria-hidden="true" >
                            <use  xlinkHref={this.props.currentTab === 4 ? "#icon-myfill" : "#icon-my"}></use>
                        </svg>  
                    </div>
                </div>
            )
       }
}

export default connect(state => ({
    currentTab: state.currentTab
  }), {
    setCurrentTab
  })(Tabs);