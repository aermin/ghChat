/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './style.scss';
import MyInfo from '../MyInfo';
import { initAppOnce } from './help';

class Tabs extends Component {
  constructor(props) {
    super(props);
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    initAppOnce(props);
  }

  render() {
    const { pathname } = this.props.location;
    const showMessageIcon =
      pathname === '/' || /\/group_chat|\/private_chat|\/robot_chat/.test(pathname);
    return (
      <div className="tabs-wrapper">
        <MyInfo />
        <div className="tab">
          <Link to="/">
            <svg className="icon " aria-hidden="true">
              <use xlinkHref={showMessageIcon ? '#icon-message-copy' : '#icon-message'} />
            </svg>
          </Link>
        </div>
        <div className="tab">
          <Link to="/setting">
            <svg className="icon " aria-hidden="true">
              <use xlinkHref={pathname === '/setting' ? '#icon-setting-copy' : '#icon-setting'} />
            </svg>
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Tabs);

Tabs.propTypes = {
  location: PropTypes.object,
  initializedApp: PropTypes.bool,
  initApp: PropTypes.func,
};

Tabs.defaultProps = {
  location: { pathname: '/' },
  initializedApp: false,
  initApp() {},
};
