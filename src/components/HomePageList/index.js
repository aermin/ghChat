import React, { Component } from 'react';
import './index.scss'; 
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import Spinner from '../spinner';
export default class HomePageList extends Component {
    	constructor(props){
		    super(props);
            this.state = {
                showSpinner: true
            }
        };
        async componentDidMount(){
             await this.props.getHomePageList();
             await this.props.getAllChatContent(this.props.homePageList);
            console.log('this.props.allChatContent', this.props.allChatContent);
             this.setState({showSpinner: false});
        }
        render() {
            const listItems = this.props.homePageList.map((data,index) =>
                <li key={index}>
                    <Link to = {data.type === 'group' ? `/group_chat/${data.group_id}` : `/private_chat/${data.other_user_id}`}>
                        <img src={data.type === 'group' ? data.group_avator : data.avator } alt={data.type === 'group' ? "群头像" : "用户头像"} className="img" />
                        {/* {data.unread &&<span className={data.type === 'group' ? "group-unread" :"private-unread" }>{data.unread}</span>} */}
                        <div className="content">
                            <div className="title">{data.type === 'group' ? data.group_name : data.name}<span>{data.time}</span></div>
                            <div className="message">{data.message}</div>
                        </div>
                    </Link>
                </li>
             );
            return (
                    <div className="home-page-list-wrapper">
                        {this.state.showSpinner && <Spinner /> }
                        <ul>{listItems}</ul>
                    </div>       
            )
       }
}

HomePageList.propTypes = {
    getHomePageList: PropTypes.func,
    homePageList: PropTypes.array
}