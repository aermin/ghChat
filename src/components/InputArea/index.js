import React, { Component } from 'react';
import './style.scss';

export default class InputArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: ''
    };
  }

  sendMessage = () => {
    this.props.sendMessage(this.state.inputMsg);
    this.state.inputMsg = '';
  }

  inputMsgChange = (event) => {
    this.setState({
      inputMsg: event.target.value
    });
  }

  render() {
    return (
      <div className="input-msg">
        <div className="left">
          <svg className="icon emoji" aria-hidden="true"><use xlinkHref="#icon-smile" /></svg>
          <svg className="icon more" aria-hidden="true"><use xlinkHref="#icon-more" /></svg>
        </div>
        <textarea value={this.state.inputMsg} onChange={this.inputMsgChange} />
        <p className="btn" onClick={this.sendMessage}>发送</p>
      </div>
    );
  }
}
