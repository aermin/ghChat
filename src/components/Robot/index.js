import React, {Component} from 'react';
import './index.scss';
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
        sendMessage =  async (value) => {
    
            this.setState({
                inputMsg: value
            }, async ()=>{
                this.props.insertMsg(
                    { message: this.state.inputMsg }
                );
                await this.props.getRobotMsg(
                    { message: this.state.inputMsg }
                )
            })

        }

        render() {

            const listItems = this.props.robotState.map((msg,index) =>
                 <li key={index}>
                 {msg.user && <ChatItem  img="https://user-images.githubusercontent.com/24861316/47977782-fc0aac00-e0f4-11e8-9686-821e2f5342ca.jpeg" msg={msg.message} name={msg.user} time={this.state.time} />}
                 {!msg.user && <ChatItem me={true} img={this.state.userInfo.avator}  msg={msg.message} name={this.state.userInfo.name} time={this.state.time} />}
              </li>
            );
            return (
                    <div className="robot-wrapper">
                        <ChatHeader title="机器人聊天"/>
                        <ul>
                            {listItems}
                        </ul>
                        <InputArea sendMessage={this.sendMessage}/>
                    </div>
            )
       }
}

// Robot.propTypes = {
//     insertMsg: PropTypes.func,
//     getRobotMsg: PropTypes.func,
//     robotState: PropTypes.array,
// }