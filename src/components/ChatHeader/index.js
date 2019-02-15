import React, { Component } from 'react';
import {
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import './style.scss';

class ChatHeader extends Component {
  constructor(props) {
    super(props);
    this._showChatInformation = false;
  }

  clickToBack = () => {
    const { history } = this.props;
    history.push('/index');
  }

  clickChatInformation = () => {
    this._showChatInformation = !this._showChatInformation;
    this.props.showChatInformation(this._showChatInformation);
  }

  render() {
    const { title, chatType, } = this.props;
    const icon = chatType === 'group' ? '#icon-group' : '#icon-people';
    return (
      <div className="chat-header-wrapper">
        <svg onClick={this.clickToBack} className="icon back-icon" aria-hidden="true"><use xlinkHref="#icon-back1" /></svg>
        <div className="chat-title">{title}</div>
        <svg onClick={this.clickChatInformation} className="icon information-icon" aria-hidden="true"><use xlinkHref={icon} /></svg>
      </div>
    );
  }
}

export default withRouter(ChatHeader);

ChatHeader.propTypes = {
  title: PropTypes.string,
  history: PropTypes.object,
  chatType: PropTypes.string.isRequired,
  showChatInformation: PropTypes.func.isRequired,
};


ChatHeader.defaultProps = {
  title: '',
  history: undefined,
};
