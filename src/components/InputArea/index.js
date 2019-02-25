import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import upload from '../../utils/qiniu';
import './style.scss';
import notification from '../Notification';

export default class InputArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: '',
      showEmojiPicker: false
    };
  }

  _sendMessage = ({ attachments = [] }) => {
    const { sendMessage } = this.props;
    const { inputMsg } = this.state;
    sendMessage(inputMsg, attachments);
    this.state.inputMsg = '';
  }

  _inputMsgChange = (event) => {
    this.setState({
      inputMsg: event.target.value
    });
  }

  _clickShowEmojiPicker = () => {
    const { showEmojiPicker } = this.state;
    this.setState({ showEmojiPicker: !showEmojiPicker });
  }

  _selectEmoji = (emoji) => {
    this.setState(state => ({ inputMsg: `${state.inputMsg} ${emoji.colons}` }));
    this._clickShowEmojiPicker();
  }

  // TODO: limit file size
  _onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = (event) => {
      console.log('file, FileReader.DONE', file, FileReader.DONE);
      const limitSize = 1000 * 1024 * 2; // 2 MB
      if (file.size > limitSize) {
        notification('发的文件不能超过2MB哦!', 'warn', 2);
        return;
      }
      if (event.target.readyState === FileReader.DONE) {
        upload(file, (fileUrl) => {
          const type = file.type.split('/')[0];
          const attachments = [{ fileUrl, type, name: file.name }];
          this._sendMessage({ attachments });
        });
      }
    };
    reader.readAsArrayBuffer(file);
  }

  //  displayContents = (contents) => {
  //    console.log('contents', contents);
  //    //  this.setState({
  //    //    inputMsg: contents
  //    //  });
  //    const element = document.getElementById('textarea');
  //    element.textContent = contents;
  //  }

  render() {
    const { inputMsg, showEmojiPicker } = this.state;
    const robotStyle = {
      visibility: 'hidden'
    };
    return (
      <div className="input-msg">
        { showEmojiPicker && <div onClick={this._clickShowEmojiPicker} className="mask" />}
        { showEmojiPicker && <Picker onSelect={this._selectEmoji} backgroundImageFn={(() => 'https://cdn.aermin.top/emojione.png')} showPreview={false} />}
        <div className="left" style={this.props.isRobotChat ? robotStyle : {}}>
          <svg onClick={this._clickShowEmojiPicker} className="icon emoji" aria-hidden="true"><use xlinkHref="#icon-smile" /></svg>
          <label className="file">
            <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-file" /></svg>
            <input type="file" className="file-input" onChange={this._onSelectFile} />
          </label>
        </div>
        <textarea value={inputMsg} onChange={this._inputMsgChange} />
        <pre id="textarea" />
        <p className="btn" onClick={this._sendMessage}>发送</p>
      </div>
    );
  }
}


InputArea.propTypes = {
  sendMessage: PropTypes.func,
  isRobotChat: PropTypes.bool,
};


InputArea.defaultProps = {
  sendMessage: undefined,
  isRobotChat: false,
};
