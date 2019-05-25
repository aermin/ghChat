import React, { Component } from 'react';
import './index.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Request from '../../utils/request';
import Spinner from '../Spinner';
import UserAvatar from '../UserAvatar';

export default class SignInSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      showSpinner: true
    };
  }

  handleChange = (event) => {
    const { target } = event;
    this.setState({ [target.name]: target.value });
  }

  async loginGithub() {
    const href = window.location.href;
    if (/\/login\?code/.test(href)) {
      const code = href.split('?code=')[1];
      const response = await Request.axios('post', '/api/v1/github_oauth', { code, clientId: this.clientId });
      localStorage.setItem('userInfo', JSON.stringify(response));
      window.location.reload();
      const originalLink = sessionStorage.getItem('originalLink');
      if (originalLink) {
        sessionStorage.removeItem('originalLink');
        window.location.href = originalLink;
        return;
      }
      window.location.href = '/';
    }
  }

  componentDidMount() {
    this.loginGithub().then(() => {
      this.setState({ showSpinner: false });
    });
  }

  handleClick = () => {
    this.props.setValue(this.state);
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
        {this.state.showSpinner && <Spinner />}
        <div className="ghChatLogo">
          <img src="https://cdn.aermin.top/ghChatIcon.png" alt="ghChatLogo" />
        </div>
        <Link to={linkUrl}>
          <span className={loginClass}>登录</span>
        </Link>
        <Link to={linkUrl}>
          <span className={registerClass}>注册</span>
        </Link>
        <div className="userAvatarWrapper">
          <UserAvatar name={name || 'Ÿ'} size="100" />
        </div>
        <div className="center">
          <input
            type="text"
            name="name"
            value={name}
            onChange={this.handleChange}
            placeholder="用户名"
              />
        </div>
        <div className="center">
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
            placeholder="密码"
              />
        </div>
        <div className="center">
          <input
            type="button"
            onClick={this.handleClick}

            value={buttonName}
              />
        </div>
        <div className="center">
          <a className="githubOAuth" href={OAuthHref}>
            <svg className="icon githubIcon" aria-hidden="true">
              <use xlinkHref="#icon-github" />
            </svg>
          </a>
        </div>


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
