import React, { Component } from 'react';
import axios from 'axios';
import UserAvatar from '../UserAvatar';
import './styles.scss';
import Button from '../Button';
import Modal from '../Modal';

export default class Setting extends Component {
  constructor(props) {
    super(props);
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      visible: false,
      githubStars: '--',
    };
  }

   _showModal = () => {
     this.setState({ visible: true });
   }

   _hideModal = () => {
     this.setState({ visible: false });
   };

   logout = () => {
     window.socket.disconnect();
     localStorage.removeItem('userInfo');
     this.props.initApp(false);
     this.props.history.push('/login');
   }

   componentDidMount() {
     axios.get('https://api.github.com/repos/aermin/react-chat').then((res) => {
       this.setState({ githubStars: res.data.stargazers_count });
     });
   }

  _openRepository = () => {
    window.open('https://github.com/aermin/react-chat');
  }

  render() {
    const {
      name, avatar, github, intro, location, website
    } = this._userInfo;
    const githubStarRender = (
      <div className="githubStarRender" onClick={this._openRepository}>
        <svg className="icon githubIcon" aria-hidden="true">
          <use xlinkHref="#icon-github-copy" />
        </svg>
        <span className="starTitle">
          {`${this.state.githubStars} Stars`}
        </span>
      </div>
    );

    return (
      <div className="setting">
        <Modal
          title="确定退出？"
          visible={this.state.visible}
          confirm={this.logout}
          hasCancel
          hasConfirm
          cancel={this._hideModal}
         />
        {githubStarRender}
        <UserAvatar name={name} src={avatar} size="60" />
        <p className="name">{name}</p>
        <div className="userInfo">
          {intro && <p>{`介绍: ${intro}`}</p>}
          {location && <p>{`来自: ${location}`}</p>}
          {website && <p>{`网站: ${website}`}</p>}
          {github && <p>{`github: ${github}`}</p>}
        </div>

        <Button clickFn={this._showModal} value="退出登录" />
      </div>
    );
  }
}
