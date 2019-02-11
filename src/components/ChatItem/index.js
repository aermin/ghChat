import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from 'emoji-mart';
import emojiPng from '../../assets/emojione.png';
import './style.scss';


export default class ChatItem extends Component {
  constructor() {
    super();
    this.state = {};
  }
  // lookInfo(){
  //     console.log('href',this.props.href)
  //     // this.$router.push(`/user_info/${this.props.href}`)
  //     this.props.history.push("/login");

  // }
  textRender = msg => (
    <div className="msg-render">
      <Emoji className="msg-render" emoji={msg} backgroundImageFn={() => emojiPng} size={26} fallback={(emoji, props) => (emoji ? `:${emoji.short_names[0]}:` : props.emoji)} />
    </div>
  );

  filesRender = attachments => attachments.map((attachment) => {
    if (attachment.type === 'image') {
      return (
        <div className="image-render" key={attachment.fileUrl}>
          <img src={attachment.fileUrl} />
        </div>
      );
    }
  })

  render() {
    const {
      me, img, time, name, msg
    } = this.props;
    let attachments = this.props.attachments;
    if (typeof attachments === 'string') {
      attachments = JSON.parse(attachments);
    }
    console.log('attachments in chatItem', attachments);
    return (
      <div className="chat-item">
        {!me && (
        <div className="otherchat">
          <img src={img} alt="" className="img" />
          <div className="nt">
            {name && <span>{ name }</span>}
            {time && <span>{ time }</span>}
          </div>
          {msg && this.textRender(msg)}
          {attachments.length > 0 && this.filesRender(attachments)}
        </div>
        )}
        {me && (
        <div className="mychat">
          <img src={img} alt="" className="img" onClick={this.lookInfo} />
          <div className="nt">
            {time && <span>{time}</span>}
            {name && <span>{name}</span>}
          </div>
          {msg && this.textRender(msg)}
          {attachments.length > 0 && this.filesRender(attachments)}
        </div>
        )}
      </div>
    );
  }
}


ChatItem.propTypes = {
  me: PropTypes.bool,
  img: PropTypes.string,
  name: PropTypes.string,
  time: PropTypes.string,
  msg: PropTypes.string,
  attachments: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ])
};

ChatItem.defaultProps = {
  me: undefined,
  img: undefined,
  name: '',
  time: undefined,
  msg: '',
  attachments: '[]'
};
