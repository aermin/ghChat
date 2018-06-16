import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../../assets/loginregister.scss";
import icon from "../../assets/icon.svg";
import axios from "axios";
import Modal from "../../components/Modal";
import Notification from 'rc-notification';
import "../../assets/notification.scss";


function notification(content){
  Notification.newInstance({}, notification => {
    notification.notice({
      content: content,
    });
  });
}

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
      axios
        .post("/api/v1/register", {
          name: this.state.name,
          password: this.state.password
        })
        .then(res => {
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
              notification(res.data.message);
          }
        })
        .catch(err => {
          notification(err);
        });
    } else {
      const content = this.state.name === "" ? "请输入用户名" : "请输入密码";
      notification(content);
    }
  };
  nameChange = event => {
    this.setState({ name: event.target.value });
  };

  passwordChange = event => {
    this.setState({ password: event.target.value });
  };

  confirm = modalEvent => {
    this.setState({
      visible: false
    });
    this.props.history.push("/login");
  };

  render() {
    return (
      <div className="login">
        <Modal
          title={this.state.modal.title}
          content={this.state.modal.message}
          visible={this.state.modal.visible}
          modalEvent={this.state.modal.modalEvent}
          confirm={this.confirm}
          hasCancel={false}
        />
        {/* <Message isShow = {this.state.message.isShow}  type = {this.state.message.type}  content = {this.state.message.content} /> */}
        <div className="wrapper fadeInDown">
          <div id="formContent">
            <Link to="/login">
              <h2 className="inactive"> 登录 </h2>
            </Link>
            <h2 className="active">注册 </h2>

            <div className="fadeIn first">
              <img src={icon} id="icon" alt="Icon" />
            </div>

            <form>
              <input
                type="text"
                className="fadeIn second"
                value={this.state.name}
                onChange={this.nameChange}
                placeholder="用户名"
              />
              <input
                type="password"
                className="fadeIn third"
                value={this.state.password}
                onChange={this.passwordChange}
                placeholder="密码"
              />
              <input
                type="button"
                onClick={this.register}
                className="fadeIn fourth"
                value="注册"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
