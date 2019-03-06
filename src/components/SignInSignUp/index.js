import React, { Component } from 'react';
import './index.scss';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import Request from '../../utils/request';
import Spinner from '../spinner';
import UserAvatar from '../UserAvatar';

class SignInSignUp extends Component {
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
      this.props.history.push('/');
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
        <div className="fadeIn first">
          <UserAvatar name={name || 'Ÿ'} size="100" />
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
        </form>
        <a className="githubOAuth" href={OAuthHref}>
          <svg className="icon githubIcon" aria-hidden="true">
            <use xlinkHref="#icon-github" />
          </svg>
        </a>
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


export default withRouter(SignInSignUp);
