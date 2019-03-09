import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ModalBase from '../ModalBase';
import UserAvatar from '../UserAvatar';
import './styles.scss';

function _openUrl(url) {
  window.open(url);
}

function userInfoRender(props) {
  const {
    name, location,
    website, github,
    intro, avatar,
  } = props && props.userInfo;
  return (
    <div className="userInfo">
      <UserAvatar name={name} src={avatar} size="50" />
      {name && <p className="name">{name}</p>}
      {intro && <p>{`介绍: ${intro}`}</p>}
      {location && <p>{`来自: ${location}`}</p>}
      {/* {status && <p>{status}</p>} */}
      {website && <p className="website" onClick={() => _openUrl(website)}>{`网站: ${website}`}</p>}
      {github && <p className="github" onClick={() => _openUrl(github)}>{`github: ${github}`}</p>}
      <svg onClick={props && props.goToChat} className="icon" aria-hidden="true">
        <use xlinkHref="#icon-message" />
      </svg>
    </div>
  );
}

const ModalRender = ModalBase(userInfoRender);

class PersonalInfo extends Component {
  goToChat = () => {
    const { user_id, name } = this.props.userInfo;
    // eslint-disable-next-line react/prop-types
    this.props.history.push(`/private_chat/${user_id}?name=${name}`);
    this.props.hide();
  }

  render() {
    const { userInfo, modalVisible, hide } = this.props;
    return (
      <ModalRender
        userInfo={userInfo}
        visible={modalVisible}
        cancel={hide}
        goToChat={this.goToChat}
      />
    );
  }
}

PersonalInfo.propTypes = {
  userInfo: PropTypes.object,
  hide: PropTypes.func,
  modalVisible: PropTypes.bool,
};

PersonalInfo.defaultProps = {
  userInfo: {},
  hide: undefined,
  modalVisible: false,
};


export default withRouter(PersonalInfo);
