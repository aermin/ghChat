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

    //获取数据库的消息
    async getPrivateMsg() {
        console.log('this.props.allChatContent',this.props.allChatContent );

        let res;
        const chatId = this.props.chatId;
        // try {
        //     res = await Request.axios('get', '/api/v1/private_detail', {
        //         to_user: chatId
        //     })
        //     if (res.success) {
        //         const { privateDetail } = res.data;
        //         this.setState({ privateDetail });
        //         const { homePageList, match } = this.props;
        //         const length = homePageList.length;
        //         for(let i = 0; i < length; i++){
        //             if (homePageList[i].id === parseInt(chatId)) {
        //                 await setStateAsync.bind(this, {
        //                     toUserInfo: {name: homePageList[i].name, to_user: homePageList[i].id}
        //                 })();
        //                 break;
        //             }
        //         }
        //     }
        // } catch (error) {
        //     console.log('error', error);
        //     const errorMsg = err.response.data.error
        //     this.$message({
        //         message: errorMsg,
        //         type: "error"
        //     });
        // }
    }
    
    sendMessage = (value) => {
        if (value.trim() == '') return;
        const { toUserInfo, fromUserInfo } = this.state;
        const data = {
            from_user: fromUserInfo.user_id, //自己的id
            to_user: toUserInfo.to_user, //对方id
            // name: fromUserInfo.name, //自己的昵称
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

    getChatContent () {
        // const {privateChat} = this.props.allChatContent;
        console.log('privateChat111', this.props);
        return;
        const length = privateChat.length;
        for(let i = 0; i < length; i++) {
            console.log(privateChat[i].userInfo.user_id, '===', this.props.chatId);
            if (privateChat[i].userInfo.user_id === this.props.chatId) {
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
            // await this.getPrivateMsg();
            this.getChatContent();
            await this.getMsgOnSocket();
        }).catch((error)=>{
            console.log(error);
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps);
        // this.setState({privateDetail: nextProps.privateDetail});
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