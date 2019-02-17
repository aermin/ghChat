/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import Request from '../../utils/request';
import Modal from '../../components/Modal';
import notification from '../../components/Notification';
import SignInSignUp from '../../components/SignInSignUp';
import './index.scss';

export default class LogIn extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      password: '',
      modal: {
        visible: false,
      }
    };
  }

  async login() {
    const { name, password } = this.state;
    if (name !== '' && password !== '') {
      try {
        const res = await Request.axios('post', '/api/v1/login', { name, password });
        if (res && res.success) {
          localStorage.setItem('userInfo', JSON.stringify(res.userInfo));
          // 弹窗
          this.setState({
            modal: {
              visible: true,
            }
          });
        } else {
          notification(res.message, 'error');
        }
      } catch (error) {
        notification(error, 'error');
      }
    } else {
      const msg = name === '' ? '请输入用户名' : '请输入密码';
      notification(msg, 'warn');
    }
  }

  setValue = (value) => {
    const { name, password } = value;
    this.setState({
      name,
      password
    }, async () => {
      await this.login();
    });
  }

  confirm = () => {
    this.setState({
      modal: {
        visible: true,
      }
    });
    window.location.pathname = '/';
  };

  componentDidMount() {
    console.log('login componentDidMount');
  }

  render() {
    const { visible } = this.state.modal;
    return (
      <div className="login">
        <Modal
          title="提示"
          visible={visible}
          confirm={this.confirm}
          hasConfirm
          hasCancel={false}
        >
          <p className="content">
            {'您已登录成功'}
          </p>
        </Modal>
        {/* <Message isShow = {this.state.message.isShow}  type = {this.state.message.type}  content = {this.state.message.content} /> */}
        <SignInSignUp setValue={this.setValue} isLogin />
      </div>
    );
  }
}
