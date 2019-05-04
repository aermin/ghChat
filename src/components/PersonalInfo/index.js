import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import classnames from 'classnames';
import ModalBase from '../ModalBase';
import UserAvatar from '../UserAvatar';
import './styles.scss';
import Button from '../Button';
import notification from '../Notification';

function _openUrl(url) {
  const formatUrl = /https:\/\/|http:\/\//.test(url) ? url : `https://${url}`;
  window.open(formatUrl);
}

function userInfoRender({
  userInfo, goToChat, isContact, deleteContact
}) {
  const {
    name, location,
    website, github,
    intro, avatar, company,
  } = userInfo;
  return (
    <div className="userInfo">
      <UserAvatar name={name} src={avatar} size="50" />
      {name && <p className="name">{name}</p>}
      {intro && <p>{`介绍: ${intro}`}</p>}
      {location && <p>{`来自: ${location}`}</p>}
      {company && <p>{`公司: ${company}`}</p>}
      {/* {status && <p>{status}</p>} */}
      {website && <p className="website" onClick={() => _openUrl(website)}>{`网站: ${website}`}</p>}
      {github && <p className="github" onClick={() => _openUrl(github)}>{`github: ${github}`}</p>}
      <Button
        className={classnames('personalInfoBtn', 'chatBtn')}
        clickFn={goToChat}
        value="私聊此人"
      />
      { isContact && (
      <Button
        className={classnames('personalInfoBtn', 'deleteBtn')}
        clickFn={deleteContact}
        value="删除此人"
      />
      )}
    </div>
  );
}

const ModalRender = ModalBase(userInfoRender);

class PersonalInfo extends Component {
  goToChat = () => {
    this.props.history.push(`/private_chat/${this.props.userInfo.user_id}`);
    this.props.hide();
  }

  deleteContact = () => {
    const myInfo = JSON.parse(localStorage.getItem('userInfo'));
    const {
      userInfo, deleteHomePageList,
      homePageList, deletePrivateChat,
      allPrivateChats
    } = this.props;
    window.socket.emit('deleteContact', {
      from_user: myInfo.user_id,
      to_user: userInfo.user_id
    }, (res) => {
      if (res.code === 200) {
        deleteHomePageList({ homePageList, chatId: userInfo.user_id });
        deletePrivateChat({ allPrivateChats, chatId: userInfo.user_id });
        this.props.hide();
        notification('删除联系人成功', 'success');
      }
    });
  }

  get isContact() {
    return this.props.homePageList.find(e => e.user_id === this.props.userInfo.user_id);
  }

  render() {
    const {
      userInfo, modalVisible,
      hide
    } = this.props;
    return (
      <ModalRender
        userInfo={userInfo}
        visible={modalVisible}
        cancel={hide}
        isContact={this.isContact}
        deleteContact={this.deleteContact}
        goToChat={this.goToChat}
      />
    );
  }
}

PersonalInfo.propTypes = {
  userInfo: PropTypes.object,
  hide: PropTypes.func,
  modalVisible: PropTypes.bool,
  homePageList: PropTypes.array.isRequired,
  deleteHomePageList: PropTypes.func,
  deletePrivateChat: PropTypes.func,
  allPrivateChats: PropTypes.instanceOf(Map),
};

PersonalInfo.defaultProps = {
  userInfo: {},
  hide: undefined,
  modalVisible: false,
  deleteHomePageList() {},
  deletePrivateChat() {},
  allPrivateChats: new Map(),
};


export default withRouter(PersonalInfo);
