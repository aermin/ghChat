import React, { Component } from "react";
import "./index.scss";
import axios from "axios";
import Modal from "../../components/Modal";
import notification from "../../components/Notification";
import SignInSignUp from "../../components/SignInSignUp"

export default class Register extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      password: "",
      modal: {
        visible: false,
        title: "提示",
        message: "", //弹窗内容
        hasCancel: true, //弹窗是否有取消键
        modalEvent: "" // 弹窗事件名称
      }
    };
  }
  register = () => {
    if (this.state.name !== "" && this.state.password !== "") {
      axios.post("/api/v1/register", {
          name: this.state.name,
          password: this.state.password
        }).then(res => {
          if (res && res.data.success) {
              //弹窗
              this.setState({
                modal: {
                  visible: true,
                  message: "您已注册成功", //弹窗内容
                  modalEvent: "register" // 弹窗事件名称
                }
              });
            } else {
              notification(res.data.message,'error');
          }
        })
        .catch(err => {
          notification(err,'error');
        });
    } else {
      const msg = this.state.name === "" ? "请输入用户名" : "请输入密码";
      notification(msg,'warn');
    }
  };

  setValue = (value) => {
    const {name, password} = value;
    this.setState({
      name : name,
      password: password
    }, () => {
      this.register();
    })
  }

  confirm = modalEvent => {
    this.setState({
      visible: false
    });
    this.props.history.push("/login");
  };

  render() {
    return (
      <div className="register">
        <Modal
          title={this.state.modal.title}
          content={this.state.modal.message}
          visible={this.state.modal.visible}
          modalEvent={this.state.modal.modalEvent}
          confirm={this.confirm}
          hasCancel={false}
        />
        {/* <Message isShow = {this.state.message.isShow}  type = {this.state.message.type}  content = {this.state.message.content} /> */}
        <SignInSignUp setValue = {this.setValue}  isLogin = {false}/>
      </div>
    );
  }
}


