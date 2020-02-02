import React from 'react';
import Notification from 'rc-notification';
import './style.scss';

function addIcon(msg, type) {
  let content;
  if (type === 'success') {
    content = (
      <div className="all-icon">
        <svg className="icon " aria-hidden="true">
          <use xlinkHref="#icon-success1" />
        </svg>{' '}
        {msg}
      </div>
    );
  } else if (type === 'warn') {
    content = (
      <div className="all-icon">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-warn1" />
        </svg>{' '}
        {msg}
      </div>
    );
  } else if (type === 'error') {
    content = (
      <div className="all-icon">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-error1" />
        </svg>{' '}
        {msg}
      </div>
    );
  }
  return content;
}

export default function notification(msg, type, duration) {
  const content = addIcon(msg, type);
  Notification.newInstance({}, notification => {
    notification.notice({
      content,
      duration,
    });
  });
}
