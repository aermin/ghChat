import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ModalBase from '../ModalBase';
import UserAvatar from '../UserAvatar';
import './styles.scss';

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
      {website && <p>{`网站: ${intro}`}</p>}
      {github && <p>{`github: ${github}`}</p>}
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
    this.props.showPersonalInfo();
  }

  render() {
    const { userInfo, modalVisible, showPersonalInfo } = this.props;
    return (
      <ModalRender
        userInfo={userInfo}
        visible={modalVisible}
        cancel={showPersonalInfo}
        goToChat={this.goToChat}
      />
    );
  }
}

PersonalInfo.propTypes = {
  userInfo: PropTypes.object,
  showPersonalInfo: PropTypes.func,
  modalVisible: PropTypes.bool,
};

PersonalInfo.defaultProps = {
  userInfo: {},
  showPersonalInfo: undefined,
  modalVisible: false,
};


export default withRouter(PersonalInfo);
