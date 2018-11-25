
import React, { Component } from "react";
import ChatItem from '../ChatItem';
import {toNomalTime} from "../../utils/transformTime";
export default class ChatContentList extends Component {
    constructor(){
        super();
        this.ulDom = React.createRef();
    }
    render() {
        const listItems = this.props.ChatContent.map((item,index) => {
            const isMe = parseInt(this.props.chatId) === item.from_user ? false : true; 
            const time = toNomalTime(item.time);
            return (<li key={index}>
                        <ChatItem me={isMe} img={item.avator} msg={item.message} name={item.name} time={time} />
                    </li>)
            }
        );
        return (
            <ul className="chat-content-list">
                {listItems}
            </ul>
        )
    }
}