import React, {Component} from 'react';
import '../../assets/chat.scss'
import ChatHeader from '../ChatHeader';
import ChatItem from '../ChatItem';
import InputArea from '../InputArea';

import {
	toNomalTime
} from "../../utils/transformTime";
import PropTypes from 'prop-types';

export default class Robot extends Component {
	constructor(){
		super();
        this.state = {
            time: toNomalTime(Date.parse(new Date()) / 1000),
            inputMsg: "",
            userInfo:{}
        }
    }
    scrollToBottom(time = 0) {
        const ulDom = document.getElementsByClassName('chat-content-list')[0];
        setTimeout(() => {
            ulDom.scrollTop = ulDom.scrollHeight + 10000;
        }, time)
    }
    sendMessage = async (value) => {
        this.setState({
            inputMsg: value
        }, async ()=>{
            this.props.insertMsg(
                { message: this.state.inputMsg }
            );
            this.scrollToBottom();
            await this.props.getRobotMsg(
                { message: this.state.inputMsg }
            );
            this.scrollToBottom();
        })

    }
    componentWillMount(){
        console.log('componentWillMount');
        this.setState({
            userInfo:JSON.parse(localStorage.getItem("userInfo"))
        }) 
    }

    componentDidMount(){
       this.scrollToBottom(200);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.robotState === this.props.robotState) {
            return false;
        }
        return true;
    }

    render() {
        const listItems = this.props.robotState.map((msg,index) =>
                <li key={index}>
                {msg.user && <ChatItem  img="https://user-images.githubusercontent.com/24861316/47977782-fc0aac00-e0f4-11e8-9686-821e2f5342ca.jpeg" msg={msg.message} name={msg.user} time={this.state.time} />}
                {!msg.user && <ChatItem me={true} img={this.state.userInfo.avator}  msg={msg.message} name={this.state.userInfo.name} time={this.state.time} />}
            </li>
        );
        return (
                <div className="chat-wrapper">
                    <ChatHeader title="机器人聊天"/>
                    <ul className="chat-content-list">
                        {listItems}
                    </ul>
                    <InputArea sendMessage={this.sendMessage}/>
                </div>
        )
    }
}

Robot.propTypes = {
    insertMsg: PropTypes.func,
    getRobotMsg: PropTypes.func,
    robotState: PropTypes.array,
}