import React, { Component } from 'react';
import './styles.scss';

export default class welcome extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="welcomeWrapper">
        <p className="title">欢迎ヾ(=･ω･=)o</p>
        <p className="content">选个群组/用户开始聊天吧ε==(づ′▽`)づ</p>
      </div>
    );
  }
}
