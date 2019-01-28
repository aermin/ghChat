import React, { Component } from 'react';
import './index.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Request from '../../utils/request';
import notification from '../Notification';
import icon from '../../assets/icon.svg';

export default class SignInSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: ''
    };
  }

  handleChange = (event) => {
    const { target } = event;
    this.setState({ [target.name]: target.value });
  }

  async loginGithub() {
    const href = window.location.href;
    if (/\?code/.test(href)) {
      const code = href.split('?code=')[1];
      const response = await Request.axios('post', '/api/v1/github_oauth', { code, clientId: this.clientId });
      localStorage.setItem('userInfo', JSON.stringify(response));
      window.location.pathname = '/';
      console.log('response11', response);
    }
  }

  componentDidMount() {
    this.loginGithub();
  }

  handleClick = () => {
    const { setValue } = this.props;
    setValue(this.state);
  }

  get clientId() {
    return '8c694af835d62f8fd490';
  }

  render() {
    const { isLogin } = this.props;
    const { name, password } = this.state;
    const loginClass = isLogin ? 'active' : 'inactive';
    const registerClass = isLogin ? 'inactive' : 'active';
    const linkUrl = isLogin ? '/register' : '/login';
    const buttonName = isLogin ? '登录' : '注册';
    const OAuthHref = `https://github.com/login/oauth/authorize?client_id=${this.clientId}`;
    return (
      <div className="formContent fadeInDown">
        <Link to={linkUrl}>
          <h2 className={loginClass}>登录</h2>
        </Link>
        <Link to={linkUrl}>
          <h2 className={registerClass}>注册</h2>
        </Link>
        <div className="fadeIn first">
          <img src={icon} id="icon" alt="Icon" />
        </div>
        <form>
          <input
            type="text"
            className="fadeIn second"
            name="name"
            value={name}
            onChange={this.handleChange}
            placeholder="用户名"
              />
          <input
            type="password"
            className="fadeIn third"
            name="password"
            value={password}
            onChange={this.handleChange}
            placeholder="密码"
              />
          <input
            type="button"
            onClick={this.handleClick}
            className="fadeIn fourth"
            value={buttonName}
              />
          <a href={OAuthHref}>
            Github登录
          </a>
        </form>
      </div>
    );
  }
}


SignInSignUp.propTypes = {
  setValue: PropTypes.func,
  isLogin: PropTypes.bool
};


SignInSignUp.defaultProps = {
  setValue() {},
  isLogin: false,
};
