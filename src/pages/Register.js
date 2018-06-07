import React, {Component} from 'react';
import {
  Link
} from 'react-router-dom'
import '../assets/loginregister.scss';
import icon from '../assets/icon.svg';
import axios from 'axios'

export default class Register extends Component {
	constructor(props){
		super(props);

    	this.state = {
            name: '',
			password: '',
			messageBox: {
				visible: false,
				message: "", //弹窗内容
				hasCancel: true, //弹窗是否有取消键
				messageBoxEvent: "" // 弹窗事件名称
			}
        };
        
    this.nameChange = this.nameChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.register = this.register.bind(this);
	}
    register () {
        if (this.state.name !== "" && this.state.password !== "") {
            axios.post(
                '/api/v1/register', {
                    name: this.state.name,
                    password: this.state.password
                }).then(res => {
                console.log(res);
                if (res) {
                    if (res.data.success) {
                        console.log("您已注册成功");
                        //弹窗
                        // this.messageBox.messageBoxEvent = 'register'
                        // this.messageBox.visible = true;
                        // this.messageBox.message = "您已注册成功";
                    } else {
                        console.log("error");
                        // this.$message({
                        //     message: res.data.message,
                        //     type: "error"
                        // });
                    }
                }
            }).catch(err => {
                console.log(err)
                // this.$message({
                //     message: '服务器出错啦',
                //     type: "error"
                // });
            })
        } else {
            const message = this.state.name === "" ? "请输入用户名" : "请输入密码";
            console.log("message", message);
            // this.$message({
            //     message: message,
            //     type: "warn"
            // });
        }

    }
    nameChange(event){
        this.setState({name: event.target.value});
    }
    passwordChange(event){
        this.setState({password: event.target.value});
    }
    render() {
        return (
            <div className="login">
                {/* <Message-box :visible="this.messageBox.visible" :messageBoxEvent="this.messageBox.messageBoxEvent" @confirm="confirm" :hasCancel=false>
                    <p slot="content">{{this.messageBox.message}}</p>
                </Message-box> */}
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <Link to="/login">
                            <h2 className="inactive"> 登录 </h2>
                        </Link>
                        <h2 className="active">注册 </h2>

                        <div className="fadeIn first">
                            <img src={icon}  id="icon" alt="Icon" />
                        </div>

                        <form>
                            <input type="text" className="fadeIn second" value={this.state.name}  onChange={this.nameChange} placeholder="用户名"/>
                            <input type="password" className="fadeIn third" value={this.state.password} onChange={this.passwordChange} placeholder="密码"/>
                            <input type="button" onClick={this.register} className="fadeIn fourth" value="注册"/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}