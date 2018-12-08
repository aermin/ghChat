import React, { Component } from 'react';
import './index.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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

  handleClick = () => {
    const { setValue } = this.props;
    setValue(this.state);
  }

  render() {
    const { isLogin } = this.props;
    const { name, password } = this.state;
    const loginClass = isLogin ? 'active' : 'inactive';
    const registerClass = isLogin ? 'inactive' : 'active';
    const linkUrl = isLogin ? '/register' : '/login';
    return (
      <div className="formContent fadeInDown">
        <Link to={linkUrl}>
          <h2 className={loginClass}> 登录 </h2>
        </Link>
        <Link to={linkUrl}>
          <h2 className={registerClass}>注册 </h2>
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
            value="登录"
              />
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
