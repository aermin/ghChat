/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import './index.scss';
import Request from '../../utils/request';
import Modal from '../../components/Modal';
import notification from '../../components/Notification';
import SignInSignUp from '../../components/SignInSignUp';

export default class Register extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      password: '',
      modal: {
        visible: false,
        title: '提示',
        message: '', // 弹窗内容
        hasCancel: true, // 弹窗是否有取消键
        modalEvent: '' // 弹窗事件名称
      }
    };
  }

  register = async () => {
    const { name, password } = this.state;
    if (name !== '' && password !== '') {
      try {
        const res = await Request.axios('post', '/api/v1/register', { name, password });
        if (res && res.success) {
          // 弹窗
          this.setState({
            modal: {
              visible: true,
              message: '您已注册成功', // 弹窗内容
              modalEvent: 'register' // 弹窗事件名称
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
  };

  setValue = (value) => {
    const { name, password } = value;
    this.setState({
      name,
      password
    }, async () => {
      await this.register();
    });
  }

  confirm = (modalEvent) => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      visible: false
    });

    // eslint-disable-next-line react/prop-types
    this.props.history.push('/login');
  };

  render() {
    const {
      title, message, visible, modalEvent
    } = this.state.modal;
    return (
      <div className="register">
        <Modal
          title={title}
          content={message}
          visible={visible}
          modalEvent={modalEvent}
          confirm={this.confirm}
          hasCancel={false}
        />
        {/* <Message isShow = {this.state.message.isShow}  type = {this.state.message.type}  content = {this.state.message.content} /> */}
        <SignInSignUp setValue={this.setValue} isLogin={false} />
      </div>
    );
  }
}
