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
         
        render() {
            const listItems = this.props.allMsgList.map((data,index) =>
                <li key={index}>
                    {data.type === 'group' && <a href="">
                    <img src={data.group_avator} alt="群头像" className="img" />
                    {data.unread &&<span className="group-unread">{data.unread}</span>}
                    </a>}
                    {data.type === 'private' && <a href="">
                    <img src={data.avator} alt="用户头像" className="img" />
                    {data.unread &&<span className="private-unread">{data.unread}</span>}
                    </a>}
                </li>
             );
            return (
                <div>
                    <div className="wrapper">
                         <ul>{listItems}</ul>
                    </div>
                </div>
            )
       }
}

// export default connect(state => ({
//     allMsgList: state.allMsgList
//   }), {getHome})(HomePageList);

  export default connect(state => ({
    allMsgList: state.homePageList.allMsgList
  }), {getHomePageList})(HomePageList);