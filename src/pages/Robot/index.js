import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getRobotMsg , insertUserMsg} from "../../redux/actions/robot";

import './style.scss';
import ChatItem from '../../components/ChatItem';
import InputArea from '../../components/InputArea';
import {
	toNomalTime
} from "../../utils/transformTime";

class Robot extends Component {
	constructor(){
		super();
         	this.state = {
                currentTab: 2,
                time: toNomalTime(Date.parse(new Date()) / 1000),
                inputMsg: "",
                userInfo:{},
                isScrollToBottom: true
             }
        }
		refresh() {
			setTimeout(() => {
				window.scrollTo(0, document.body.scrollHeight + 10000)
			}, 0)
        }
        componentWillMount(){
            this.setState({
                userInfo:JSON.parse(localStorage.getItem("userInfo"))
            }) 
        }
        componentDidMount(){
            setTimeout(() => {
                this.refresh();
            }, 200)
        }
        sendMessage = (value) => {
            this.setState({
                inputMsg: value
            })
            if (this.state.inputMsg.trim() == '') return;
            this.props.insertUserMsg(
                { message: this.state.inputMsg }
            );//提交自己的内容
            this.props.getRobotMsg(
                { message: this.state.inputMsg }
            );
            console.log("value2333", value);
        }
        render() {
            console.log("this.props.robotMsg", this.props.robotMsg)
            const listItems = this.props.robotMsg.map((msg,index) =>
                 <li key={index}>
                 {msg.user && <ChatItem  img="http://ooytyiziz.bkt.clouddn.com/robot.gif" msg={msg.message} name={msg.user} time={this.state.time} />}
                 {!msg.user && <ChatItem me="true" img={this.state.userInfo.avator}  msg={msg.message} name={this.state.userInfo.name} time={this.state.time} />}
              </li>
            );
            return (
                    <div className="robot-wrapper">
                        <ul>
                            {listItems}
                        </ul>
                        <InputArea sendMessage={this.sendMessage}/>
                    </div>
            )
       }
}

export default connect(state => ({
    robotMsg: state.robot.robotMsg
  }), {
    getRobotMsg,
    insertUserMsg
  })(Robot);