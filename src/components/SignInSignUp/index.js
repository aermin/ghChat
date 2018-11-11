import React, { Component } from "react";
import icon from "../../assets/icon.svg";
import "../../assets/loginregister.scss";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

export default class SignInSignUp extends Component {
	constructor(props){
   super(props);
   this.state = {
     name: '',
     password: ''
   }
  }

  handleChange = (event) => {
    const target = event.target;
    this.setState({[target.name]: target.value});
  }

  handleClick = () => {
      this.props.setValue(this.state)
  }

  render() {
      return (
        <div className="wrapper fadeInDown">
          <div id="formContent">
            <h2 className="active"> 登录 </h2>
            <Link to="/register">
                <h2 className="inactive">注册 </h2>
            </Link>
            <div className="fadeIn first">
              <img src={icon} id="icon" alt="Icon" />
            </div>

            <form>
              <input
                type="text"
                className="fadeIn second"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
                placeholder="用户名"
              />
              <input
                type="password"
                className="fadeIn third"
                name="password"
                value={this.state.password}
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
        </div>
      )
  }
}


SignInSignUp.propTypes = {
  setValue: PropTypes.func,
}