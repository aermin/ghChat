import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getRobotMsg , insertUserMsg} from "../../redux/actions/robot";

import './style.scss';
import ChatItem from '../../components/ChatItem';
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
        inputMsgChange = (event) =>{
            this.setState({
                inputMsg:event.target.value
            })
        }
        sendMessage = async () =>{
			if (this.state.inputMsg.trim() == '') return;
            this.props.insertUserMsg(
                { message: this.state.inputMsg}
            );//提交自己的内容
            this.props.getRobotMsg(
                { message: this.state.inputMsg}
            ); 
			this.state.inputMsg = '';
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
                        <div className="input-msg">
                            <svg className="icon emoji" aria-hidden="true"><use  xlinkHref="#icon-smile"></use></svg>
                             
                            <textarea value={this.state.inputMsg} onChange={this.inputMsgChange}></textarea>
                            <p className="btn" onClick={this.sendMessage}>发送</p>
                        </div>
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