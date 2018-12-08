import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

export default class ChatHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title } = this.props;
    return (
      <div className="chat-header-wrapper">
        <div className="chat-title">{title}</div>
      </div>
    );
  }
}

ChatHeader.propTypes = {
  title: PropTypes.string,
};


ChatHeader.defaultProps = {
  title: ''
};
