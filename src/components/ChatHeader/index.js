import React, { Component } from 'react';
import {
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import './style.scss';

class ChatHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  clickToBack = () => {
    const { history } = this.props;
    history.push('/index');
  }

  render() {
    const { title } = this.props;
    return (
      <div className="chat-header-wrapper">
        <svg onClick={this.clickToBack} className="icon back-icon" aria-hidden="true"><use xlinkHref="#icon-back1" /></svg>
        <div className="chat-title">{title}</div>
      </div>
    );
  }
}

export default withRouter(ChatHeader);

ChatHeader.propTypes = {
  title: PropTypes.string,
  history: PropTypes.object
};


ChatHeader.defaultProps = {
  title: '',
  history: undefined,
};
