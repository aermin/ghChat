import React, { Component } from 'react';
import './style.scss';

export default class ChatHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="chat-header-wrapper">
        <div className="chat-title">{this.props.title}</div>
      </div>
    );
  }
}
