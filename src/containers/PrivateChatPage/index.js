import React, {Component} from 'react';
import {connect} from 'react-redux';
import { updateAllChatContentByGotAction, updateAllChatContentBySentAction } from '../HomePageList/getHomePageListAction'
import ChatHeader from '../../components/ChatHeader';
import InputArea from '../../components/InputArea';
import ChatContentList from '../../components/ChatContentList'
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
            to_user: toUserInfo.user_id, //对方id
            avator: fromUserInfo.avator, //自己的头像
            message: value, //消息内容
            type: 'private',
            status: '1', //是否在线 0为不在线 1为在线
            time: Date.parse(new Date()) / 1000 //时间
        };
        socket.emit('sendPrivateMsg', data);
        // 存此条私聊信息到本地
        data.time = toNomalTime(data.time);
        const {allChatContent} = this.props;
        this.setState((state)=>({
            privateDetail: [...state.privateDetail, data]
        }), ()=>{
            // push in allChatContent
            this.props.updateAllChatContentBySent({allChatContent, newChatContent: data, chatType:'privateChat'});
        });
    }

    // 获取socket消息
    getMsgOnSocket() {
        socket.removeAllListeners('getPrivateMsg');
        socket.on('getPrivateMsg',  (data) => {
            const {allChatContent} = this.props;
            this.setState((state)=>({
                privateDetail: [...state.privateDetail, data]
            }), ()=>{
                // push in allChatContent
              this.props.updateAllChatContentByGot({allChatContent, newChatContent: data, chatType:'privateChat'});
            });
           
        })
    }

    getChatContent ({allChatContent, chatId}) {
        const { privateChat } = allChatContent; // privateChat is a Map
        console.log('privateChat22', privateChat);
        const { privateDetail,  userInfo} =  privateChat.get(parseInt(chatId));
        this.setState({
            toUserInfo: userInfo,
            privateDetail:  privateDetail
        })
    }

    async componentDidMount(){
        const fromUserInfo =  JSON.parse(localStorage.getItem("userInfo"));
        await this.setState({fromUserInfo});
        const {allChatContent, chatId} = this.props;
        await this.getChatContent({allChatContent, chatId});
        this.getMsgOnSocket();
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps);
        const {allChatContent, chatId} = nextProps;
        this.getChatContent({allChatContent, chatId});
        this.getMsgOnSocket();
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
    allChatContent: state.allChatContentState
})

const mapDispatchToProps = (dispatch)=> ({
    updateAllChatContentByGot: async ({allChatContent, newChatContent, chatType}) => {
        dispatch(await updateAllChatContentByGotAction({allChatContent,newChatContent,chatType}))
    },
    updateAllChatContentBySent: async ({allChatContent, newChatContent, chatType}) => {
        dispatch(await updateAllChatContentBySentAction({allChatContent,newChatContent,chatType}))
    }
})

export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateChat));