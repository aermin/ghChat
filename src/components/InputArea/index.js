import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import emojiPng from '../../assets/emojione.png';
import './style.scss';

export default class InputArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: '',
      showEmojiPicker: false
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

  clickShowEmojiPicker = () => {
    const { showEmojiPicker } = this.state;
    this.setState({ showEmojiPicker: !showEmojiPicker });
  }

  selectEmoji = (emoji) => {
    console.log('emoji233', emoji);
    this.setState({ inputMsg: emoji.colons });
  }

  render() {
    const { inputMsg, showEmojiPicker } = this.state;
    return (
      <div className="input-msg">
        { showEmojiPicker && <div onClick={this.clickShowEmojiPicker} className="mask" />}
        { showEmojiPicker && <Picker onSelect={this.selectEmoji} backgroundImageFn={(() => emojiPng)} showPreview={false} />}
        <div className="left">
          <svg onClick={this.clickShowEmojiPicker} className="icon emoji" aria-hidden="true"><use xlinkHref="#icon-smile" /></svg>
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
