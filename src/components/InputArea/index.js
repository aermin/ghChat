import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

export default class InputArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: ''
    };
  }

  sendMessage = () => {
    const { sendMessage } = this.props;
    const { inputMsg } = this.state;
    sendMessage(inputMsg);
    this.state.inputMsg = '';
  }

  inputMsgChange = (event) => {
    this.setState({
      inputMsg: event.target.value
    });
  }

  render() {
    const { inputMsg } = this.state;
    return (
      <div className="input-msg">
        <div className="left">
          <svg className="icon emoji" aria-hidden="true"><use xlinkHref="#icon-smile" /></svg>
          <svg className="icon more" aria-hidden="true"><use xlinkHref="#icon-more" /></svg>
        </div>
        <textarea value={inputMsg} onChange={this.inputMsgChange} />
        <p className="btn" onClick={this.sendMessage}>发送</p>
      </div>
    );
  }
}


InputArea.propTypes = {
  sendMessage: PropTypes.func,
};


InputArea.defaultProps = {
  sendMessage: undefined
};
