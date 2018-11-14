import React, { Component } from 'react';
import './index.scss';
import { Link } from 'react-router-dom'

export default class HomePageList extends Component {
	constructor(){
		super();
         	this.state = {}
        }

        componentDidMount(){
             this.props.getHomePageList();
        }
        render() {
            const listItems = this.props.homePageList.map((data,index) =>
                <li key={index}>
                    <Link to = {data.type === 'group' ? `/group_chat/${data.group_id}` : `/private_chat/${data.other_user_id}`}>
                        <img src={data.type === 'group' ? data.group_avator : data.avator } alt={data.type === 'group' ? "群头像" : "用户头像"} className="img" />
                        {data.unread &&<span className={data.type === 'group' ? "group-unread" :"private-unread" }>{data.unread}</span>}
                        <div className="content">
                            <div className="title">{data.type === 'group' ? data.group_name : data.name}<span>{data.time}</span></div>
                            <div className="message">{data.message}</div>
                        </div>
                    </Link>
                </li>
             );
            return (
                    <div className="home-page-list-wrapper">
                         <ul>{listItems}</ul>
                    </div>       
            )
       }
}