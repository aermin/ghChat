import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getHomePageList,getHome} from "../../redux/actions/homePageList";
import './style.scss';
class HomePageList extends Component {
	constructor(){
		super();
         	this.state = {}
        }

        componentDidMount(){
             this.props.getHomePageList();
        }
        goChat(type){
            console.log('goChat',type);
            
        }
        render() {
            const listItems = this.props.allMsgList.map((data,index) =>
                <li key={index} onClick={() => this.goChat(data.type)}>
                    <img src={data.type === 'group' ? data.group_avator : data.avator } alt={data.type === 'group' ? "群头像" : "用户头像"} className="img" />
                    {data.unread &&<span className={data.type === 'group' ? "group-unread" :"private-unread" }>{data.unread}</span>}
                    <div className="content">
                        <div className="title">{data.type === 'group' ? data.group_name : data.name}<span>{data.time}</span></div>
                        <div className="message">{data.message}</div>
                    </div>
                </li>
             );
            return (
                    <div className="home-page-list-wrapper">
                         <ul>{listItems}</ul>
                    </div>       
            )
       }
}

  export default connect(state => ({
    allMsgList: state.homePageList.allMsgList
  }), {getHomePageList})(HomePageList);