/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import Fuse from 'fuse.js';
import upload from '../../utils/qiniu';
import request from '../../utils/request';
import './style.scss';
import notification from '../Notification';
import debounce from '../../utils/debounce';
import { shareAction } from '../../redux/actions/shareAction';
import store from '../../redux/store';

function getPlaceholder(isRobotChat) {
  switch (true) {
    case /group_chat/.test(window.location.href):
      return '支持Enter发信息/粘贴发图/@别人哦';
    case isRobotChat:
      return '支持Enter发信息哦';
    default:
      return '支持Enter发信息/粘贴发图哦';
  }
}

export default class InputArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMsg: '',
      showEmojiPicker: false,
      relatedMembers: [],
    };
    this._uploadToken = null;
    this._onPaste = props.isRobotChat ? () => {} : debounce(this._paste, 2000, true);
    this._placeHolder = getPlaceholder(props.isRobotChat);
  }

  _sendMessage = ({ attachments = [], message }) => {
    const { sendMessage } = this.props;
    const { inputMsg } = this.state;
    sendMessage(message || inputMsg, attachments);
    this.state.inputMsg = '';
    this.nameInput.focus();
  };

  _selectSomeOneOrNot = () => {
    const { inputMsg } = this.state;
    const shouldPrompt = /\S*@$|\S*@\S+$/.test(inputMsg);
    if (!shouldPrompt) {
      this.setState({ relatedMembers: [] });
      return;
    }
    const groupMembers = this.props.groupMembers;
    if (groupMembers && groupMembers.length > 1) {
      const fuse = new Fuse(groupMembers, this.filterOptions);
      const filterText = /@\S*$/.exec(inputMsg)[0].slice(1);
      const relatedMembers = filterText ? fuse.search(filterText) : groupMembers;
      this.setState({ relatedMembers });
    }
  };

  _inputMsgChange = event => {
    this.setState(
      {
        inputMsg: event.target.value,
      },
      () => {
        this._selectSomeOneOrNot();
      },
    );
  };

  _clickShowEmojiPicker = () => {
    const { showEmojiPicker } = this.state;
    this.setState({ showEmojiPicker: !showEmojiPicker });
  };

  _selectEmoji = emoji => {
    this.setState(state => ({ inputMsg: `${state.inputMsg} ${emoji.colons}` }));
    this._clickShowEmojiPicker();
    this.nameInput.focus();
  };

  componentDidMount() {
    if (this.props.shareData) {
      this._sendMessage({ message: `::share::${JSON.stringify(this.props.shareData)}` });
      store.dispatch(shareAction(null));
    }
    this.nameInput.focus();
  }

  _fetchUpLoadToken = async () => {
    if (!this._uploadToken) {
      this._uploadToken = await request.socketEmitAndGetResponse('getQiniuToken');
    }
  };

  _onSelectFile = e => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async event => {
      const limitSize = 1000 * 1024 * 2; // 2 MB
      if (file.size > limitSize) {
        notification('发的文件不能超过2MB哦!', 'warn', 2);
        return;
      }
      if (event.target.readyState === FileReader.DONE) {
        await this._fetchUpLoadToken();
        upload(file, this._uploadToken, fileUrl => {
          const type = file.type.split('/')[0];
          const attachments = [{ fileUrl, type, name: file.name }];
          this._sendMessage({ attachments });
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  //  displayContents = (contents) => {
  //    console.log('contents', contents);
  //    //  this.setState({
  //    //    inputMsg: contents
  //    //  });
  //    const element = document.getElementById('textarea');
  //    element.textContent = contents;
  //  }

  _keyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      this._sendMessage({ attachments: [] });
      e.preventDefault();
    }
  };

  get filterOptions() {
    const options = {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name'],
    };
    return options;
  }

  _clickSomeOneSelected = name => {
    this.setState(
      state => {
        const newInputMsg = state.inputMsg.replace(/@\S*$/, `@${name} `);
        return { inputMsg: newInputMsg, relatedMembers: [] };
      },
      () => {
        this.nameInput.focus();
      },
    );
  };

  filterMembersRender = () => {
    const { relatedMembers } = this.state;
    return (
      <ul className="filterMembers">
        {relatedMembers &&
          relatedMembers.length > 0 &&
          relatedMembers.map((e, index) => (
            <li key={index} onClick={() => this._clickSomeOneSelected(e.name)}>
              {e.name}
            </li>
          ))}
      </ul>
    );
  };

  _paste = async e => {
    const clipboardData = e.clipboardData || e.originalEvent.clipboardData;
    const items = clipboardData && clipboardData.items;
    if (!items) return;
    const len = items.length;
    for (let i = 0; i < len; i += 1) {
      if (items[i].kind === 'file') {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) {
          return;
        }
        const limitSize = 1000 * 1024 * 2; // 2 MB
        if (file.size > limitSize) {
          notification('发的文件不能超过2MB哦!', 'warn', 2);
          return;
        }
        await this._fetchUpLoadToken();
        upload(file, this._uploadToken, fileUrl => {
          const type = file.type.split('/')[0];
          const attachments = [{ fileUrl, type, name: file.name }];
          this._sendMessage({ attachments });
        });
      }
    }
  };

  render() {
    const { inputMsg, showEmojiPicker, relatedMembers } = this.state;
    const robotStyle = {
      visibility: 'hidden',
    };
    const buttonClass = inputMsg ? 'btn btnActive' : 'btn';
    return (
      <div className="input-msg">
        {showEmojiPicker && <div onClick={this._clickShowEmojiPicker} className="mask" />}
        {showEmojiPicker && (
          <Picker
            onSelect={this._selectEmoji}
            backgroundImageFn={() => 'https://cdn.aermin.top/emojione.png'}
            showPreview={false}
          />
        )}
        <div className="left" style={this.props.isRobotChat ? robotStyle : {}}>
          <svg onClick={this._clickShowEmojiPicker} className="icon emoji" aria-hidden="true">
            <use xlinkHref="#icon-smile" />
          </svg>
          <label className="file">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-file" />
            </svg>
            <input type="file" className="file-input" onChange={this._onSelectFile} />
          </label>
        </div>
        {relatedMembers && relatedMembers.length > 0 && this.filterMembersRender()}
        <textarea
          ref={input => {
            this.nameInput = input;
          }}
          value={inputMsg}
          onChange={this._inputMsgChange}
          placeholder={this._placeHolder}
          onPaste={this._onPaste}
          onKeyPressCapture={this._keyPress}
        />
        {/* <pre id="textarea" /> */}
        <p className={buttonClass} onClick={this._sendMessage}>
          发送
        </p>
      </div>
    );
  }
}

InputArea.propTypes = {
  sendMessage: PropTypes.func,
  isRobotChat: PropTypes.bool,
  shareData: PropTypes.object,
};

InputArea.defaultProps = {
  sendMessage: undefined,
  isRobotChat: false,
  shareData: undefined,
};
