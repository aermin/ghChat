import React, {Component} from 'react';
import ChatHeader from '../../components/ChatHeader';
import ChatItem from '../../components/ChatItem';
import InputArea from '../../components/InputArea';
import setStateAsync  from '../../utils/setStateAsync';
import Request from '../../utils/request'
import {
    withRouter,
  } from 'react-router-dom'
class PrivateChat extends Component {
	constructor(){
		super();
         	this.state = {
                inputMsg: '',
                privateDetail: [], //私聊相关
                toUserInfo: {},
                isMyFriend: false, //他是否是我的好友
                isHisFriend: false, //我是否是他的好友
                fromUserInfo: {}, //用户自己
                btnInfo: "发送"
             }
        }

        //获取数据库的消息
		async getPrivateMsg() {
            let res;
            try {
                res = await Request.axios('get', '/api/v1/private_detail', {
                    to_user: this.props.match.params.user_id
	            })
                console.log('res222221', res);
                if (res.success) {
                    const { privateDetail } = res.data;
                    this.setState({ privateDetail });
                    const length = privateDetail.length;
                    for(let i = 0; i < length; i++){
                        if (privateDetail[i].from_user === parseInt(this.props.match.params.user_id)) {
                            await setStateAsync.bind(this, { 
                                toUserInfo: {name: privateDetail[i].name, to_user: privateDetail[i].from_user}
                            })();
                            break;
                  
                        }
                    }
                }
            } catch (error) {
                console.log('error', error);
                const errorMsg = err.response.data.error
                this.$message({
                    message: errorMsg,
                    type: "error"
                });
            }
		}

        async componentWillMount(){
            await this.setState({
                fromUserInfo: JSON.parse(localStorage.getItem("userInfo"))
            });
            await this.getPrivateMsg();
            console.log('this.state.toUserInfo', this.state.toUserInfo);
        }
        
        sendMessage = () => {
            
        }


        
        render() {   
            const listItems = this.state.privateDetail.map((item,index) =>
                <li key={index}>
                    {this.state.fromUserInfo.user_id === item.from_user ? <ChatItem me={true} img={item.avator} msg={item.message} name={item.name} time={item.time} />
                    : <ChatItem img={item.avator}  msg={item.message} name={item.name} time={item.time} />}
                </li>
            );
            return (
                <div className="robot-wrapper">
                <ChatHeader title={this.state.toUserInfo.name}/>
                <ul>
                    {listItems}
                </ul>
                <InputArea sendMessage={this.sendMessage}/>
            </div>
            )
       }
}

export default  withRouter(PrivateChat);
// export default connect(state => ({
//     robotMsg: state.robot.robotMsg
//   }), {
//     getRobotMsg,
//     insertUserMsg
//   })(GroupChat);