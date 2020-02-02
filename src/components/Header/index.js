import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CreateGroupModal from '../CreateGroupModal';
import './style.scss';
import SearchBox from '../SearchBox';
import MyInfo from '../MyInfo';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGroupModal: false,
    };
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  confirm = ({ groupName, groupNotice }) => {
    this.setState({
      showGroupModal: false,
    });
    this.createGroup({ groupName, groupNotice });
  };

  createGroup = ({ groupName, groupNotice }) => {
    const { name, user_id } = this._userInfo;
    const data = {
      name: groupName,
      group_notice: groupNotice,
      creator_id: user_id,
      // create_time: Date.parse(new Date()) / 1000
    };
    window.socket.emit('createGroup', data, res => {
      const {
        addGroupMessageAndInfo,
        updateHomePageList,
        homePageList,
        allGroupChats,
      } = this.props;
      const members = [
        {
          user_id,
          name,
          status: 1,
        },
      ];
      const groupInfo = Object.assign({ members }, res);
      res.message = `${name}: 创建群成功！`;
      res.time = res.create_time;
      res.from_user = res.creator_id;
      updateHomePageList({ data: res, homePageList });
      addGroupMessageAndInfo({
        allGroupChats,
        message: { ...res, name },
        groupId: res.to_group_id,
        groupInfo,
      });
      this.props.history.push(`/group_chat/${res.to_group_id}`);
    });
  };

  openModal = () => {
    this.setState({
      showGroupModal: true,
    });
  };

  cancel = () => {
    this.setState({
      showGroupModal: false,
    });
  };

  render() {
    const { isSearching, searchFieldChange } = this.props;
    return (
      <div className="header-wrapper">
        <MyInfo />
        <SearchBox searchFieldChange={searchFieldChange} isSearching={isSearching} />
        <span className="add" onClick={this.openModal}>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-add" />
          </svg>
        </span>
        <CreateGroupModal
          title="创建群组"
          modalVisible={this.state.showGroupModal}
          confirm={args => this.confirm(args)}
          hasCancel
          hasConfirm
          cancel={this.cancel}
        />
      </div>
    );
  }
}

Header.propTypes = {
  updateHomePageList: PropTypes.func,
  homePageList: PropTypes.array,
  allGroupChats: PropTypes.object,
  searchFieldChange: PropTypes.func,
  isSearching: PropTypes.bool,
  addGroupMessageAndInfo: PropTypes.func,
};

Header.defaultProps = {
  updateHomePageList: undefined,
  homePageList: [],
  allGroupChats: new Map(),
  searchFieldChange: undefined,
  isSearching: false,
  addGroupMessageAndInfo() {},
};
