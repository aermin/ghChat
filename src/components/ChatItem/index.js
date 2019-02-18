import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from 'emoji-mart';
import UserAvatar from '../UserAvatar';
import emojiPng from '../../assets/emojione.png';
import './style.scss';


export default class ChatItem extends Component {
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
    return (
      <a
        key={attachment.fileUrl}
        download
        href={`${attachment.fileUrl}?attname=${attachment.name}`}
        className="other-file-render"
      >
        {attachment.name || 'unknown file'}
        <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-download" /></svg>
      </a>
    );
  })

  render() {
    const {
      me, img, time, name, msg, clickAvatar
    } = this.props;
    let attachments = this.props.attachments;
    if (typeof attachments === 'string') {
      attachments = JSON.parse(attachments);
    }
    // TODO: reduce needless render
    // console.log('attachments in chatItem', attachments);

    return (
      <div className="chat-item">
        {me ? (
          <div className="mychat">
            <UserAvatar name={name} src={img} size="40" />
            <div className="nt">
              {time && <span>{time}</span>}
              {name && <span>{name}</span>}
            </div>
            {msg && this.textRender(msg)}
            {attachments.length > 0 && this.filesRender(attachments)}
          </div>
        ) : (
          <div className="otherchat">
            <UserAvatar name={name} src={img} size="40" clickAvatar={clickAvatar} />
            <div className="nt">
              {name && <span>{ name }</span>}
              {time && <span>{ time }</span>}
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
  ]),
  clickAvatar: PropTypes.func,
};

ChatItem.defaultProps = {
  me: undefined,
  img: undefined,
  name: '',
  time: undefined,
  clickAvatar: undefined,
  msg: '',
  attachments: '[]'
};
