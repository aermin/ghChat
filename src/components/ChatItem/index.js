import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  render() {
    const {
      me, img, time, name, msg
    } = this.props;
    return (
      <div className="chat-item">
        {!me && (
        <div className="otherchat">
          <img src={img} alt="" className="img" />
          <div className="nt">
            {name && <span>{ name }</span>}
            {time && <span>{ time }</span>}
          </div>
          <div className="msg">{msg}</div>
        </div>
        )}
        {me && (
        <div className="mychat">
          <img src={img} alt="" className="img" onClick={this.lookInfo} />
          <div className="nt">
            {time && <span>{time}</span>}
            {name && <span>{name}</span>}
          </div>
          <div className="msg">{msg}</div>
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
};

ChatItem.defaultProps = {
  me: undefined,
  img: undefined,
  name: '',
  time: undefined,
  msg: '',
};
