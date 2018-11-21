import React, {Component} from 'react';
import {connect} from 'react-redux';
import ChatHeader from '../../components/ChatHeader';
import InputArea from '../../components/InputArea';
import ChatContentList from '../../components/ChatContentList'
import setStateAsync  from '../../utils/setStateAsync';
import Request from '../../utils/request';
import {toNomalTime} from "../../utils/transformTime";
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
    
    sendMessage = (value) => {
        if (value.trim() == '') return;
        const { toUserInfo, fromUserInfo } = this.state;
        const data = {
            from_user: fromUserInfo.user_id, //自己的id
            to_user: toUserInfo.to_user, //对方id
            avator: fromUserInfo.avator, //自己的头像
            message: value, //消息内容
            type: 'private',
            status: '1', //是否在线 0为不在线 1为在线
            time: Date.parse(new Date()) / 1000 //时间
        };
        socket.emit('sendPrivateMsg', data);
        // 存此条私聊信息到本地
        data.time = toNomalTime(data.time);
        this.setState((state)=>({
            privateDetail: [...state.privateDetail, data]
        }));
        // this.$store.commit('updateListMutation', data);
    }

    // 获取socket消息
    getMsgOnSocket() {
        socket.on('getPrivateMsg', (data) => {
            this.setState((state)=>({
                privateDetail: [...state.privateDetail, data]
            }));
        })
    }

    getChatContent ({allChatContent, chatId}) {
        const { privateChat } = allChatContent;
        const length = privateChat.length;
        for(let i = 0; i < length; i++) {
            if (privateChat[i].userInfo.user_id === parseInt(chatId)) {
                this.setState({
                    toUserInfo: privateChat[i].userInfo,
                    privateDetail:  privateChat[i].privateDetail
                })
            }            
        }
    }

    componentDidMount(){
        setStateAsync.bind(this, {
            fromUserInfo: JSON.parse(localStorage.getItem("userInfo"))
        })().then(async() =>{
            const {allChatContent, chatId} = this.props;
            this.getChatContent({allChatContent, chatId});
            await this.getMsgOnSocket();
        }).catch((error)=>{
            console.log(error);
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps);
        const {allChatContent, chatId} = nextProps;
        this.getChatContent({allChatContent, chatId});
    }

    render() {  
        const { chatId } = this.props; 
        return (
            <div className="robot-wrapper">
                <ChatHeader title={this.state.toUserInfo.name}/>
                <ChatContentList ChatContent = {this.state.privateDetail} chatId = {chatId}/>
                <InputArea sendMessage={this.sendMessage}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    //  homePageList: state.homePageListState
    // ,
    allChatContent: state.allChatContentState
})

export default  withRouter(connect(mapStateToProps)(PrivateChat));
// export default connect(state => ({
//     robotMsg: state.robot.robotMsg
//   }), {
//     getRobotMsg,
//     insertUserMsg
//   })(GroupChat);