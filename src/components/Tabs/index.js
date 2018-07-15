import React, {Component} from 'react';
import {
    withRouter,
    Link
  } from 'react-router-dom'

import './style.scss';

class Tabs extends Component {
	constructor(props){
        super(props);
         	this.state = {}
        }

        render() {
            return (
                <div className="tabs-wrapper">
                    <div className="tab tab-one" >
                         <Link to="/">
                        <svg className="icon " aria-hidden="true" >
                            <use  xlinkHref={this.props.match.url === '/' ? "#icon-messagefill" : "#icon-message1"}></use>
                        </svg> 
                        </Link>
                    </div>
                    <div className="tab tab-two" >
                        <Link to="/contact">
                            <svg className="icon " aria-hidden="true" >
                                <use  xlinkHref={this.props.match.url === '/contact' ? "#icon-group_fill" : "#icon-group"}></use>
                            </svg> 
                        </Link>
                    </div>
                    <div className="tab tab-three" >
                        <Link to="/robot">
                            <svg className="icon " aria-hidden="true" >
                                <use  xlinkHref={this.props.match.url === '/robot' ? "#icon-zhinengfenxi1" : "#icon-zhinenghua" }></use>
                            </svg>
                        </Link>
                    </div>
                </div>
            )
       }
}

export default  withRouter(Tabs)