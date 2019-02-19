import React, { Component } from 'react';
import {
  withRouter
} from 'react-router-dom';
import UserAvatar from '../UserAvatar';
import './styles.scss';
import Button from '../Button';
import Modal from '../Modal';

class Setting extends Component {
  constructor(props) {
    super(props);
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      visible: false,
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
     this.props.history.push('/login');
   }

   render() {
     const {
       name, avatar, github, intro, location, website
     } = this._userInfo;
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
         <UserAvatar name={name} src={avatar} size="60" />
         <p className="name">{name}</p>
         <div className="userInfo">
           {intro && <p>{`介绍: ${intro}`}</p>}
           {location && <p>{`来自: ${location}`}</p>}
           {/* {status && <p>{status}</p>} */}
           {website && <p>{`网站: ${intro}`}</p>}
           {github && <p>{`github: ${github}`}</p>}
         </div>

         <Button clickFn={this._showModal} value="退出登录" />
       </div>
     );
   }
}


export default withRouter(Setting);
