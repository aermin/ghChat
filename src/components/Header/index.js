import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTabShow } from '../../redux/actions/whichShow';
import './style.scss';

const SearchBox = () => (
  <div className="search-box">
    <svg className="icon" aria-hidden="true">
      {' '}
      <use xlinkHref="#icon-search1" />
    </svg>
    <input type="text" placeholder="搜索用户/群" />
  </div>
);

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: {}
    };
  }

  componentWillMount() {
    this.setState({
      userInfo: JSON.parse(localStorage.getItem('userInfo'))
    });
  }

  render() {
    const { userInfo } = this.state;
    return (
      <div className="header-wrapper">
        <img src={userInfo.avator} alt="" />
        <SearchBox />
        <svg className="icon add" aria-hidden="true"><use xlinkHref="#icon-add" /></svg>
      </div>
    );
  }
}

// export default connect(state => ({
//     tabShow: state.whichShow.tabShow
//   }), {
//     setTabShow
//   })(Header);
