import React, {Component} from 'react';
import ChatItem from '../../components/ChatItem';

export default class HomePageList extends Component {
	constructor(){
		super();

         	this.state = {}
        }

        componentWillMount(){
            
        }
         
        render() {
            const listItems = this.props.msgList.map((data,index) =>
                <li key={index}>
                    {data.type === 'group' && <a href="">
                    <img src={data.group_avatar} alt="群头像" className="img" />
                    {data.unread &&<span className="group-unread">{data.unread}</span>}
                    </a>}
                    {data.type === 'private' && <a href="">
                    <img src={data.group_avatar} alt="用户头像" className="img" />
                    {data.unread &&<span className="private-unread">{data.unread}</span>}
                    </a>}
                </li>
             );
            return (
                <div>
                    <div class="wrapper">
                    <ul>{listItems}</ul>
                    </div>
                </div>
            )
       }
}

export default connect(state => ({
    allMsgList: state.allMsgList
  }), {
    getHomePageList
  })(HomePageList);