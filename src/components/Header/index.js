import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CreateGroupModal from '../CreateGroupModal';
import './style.scss';
import SearchBox from '../SearchBox';
import UserAvatar from '../UserAvatar';
import PersonalInfo from '../PersonalInfo';
import ShareModal from '../ShareModal';
import store from '../../redux/store';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGroupModal: false,
      showShareModal: false,
      showPersonalInfo: false,
    };
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  confirm = ({ groupName, groupNotice }) => {
    this.setState({
      showGroupModal: false
    });
    this.createGroup({ groupName, groupNotice });
  };

  createGroup = ({ groupName, groupNotice }) => {
    const { name, user_id } = this._userInfo;
    const data = {
      name: groupName,
      group_notice: groupNotice,
      creator_id: user_id,
      create_time: Date.parse(new Date()) / 1000
    };
    window.socket.emit('createGroup', data, (res) => {
      const {
        addGroupMessageAndInfo, updateHomePageList, homePageList, allGroupChats,
      } = this.props;
      const members = [{
        user_id,
        name,
        status: 1
      }];
      const groupInfo = Object.assign({ members }, res);
      res.message = `${name}: 创建群成功！`;
      res.time = res.create_time;
      res.from_user = res.creator_id;
      updateHomePageList({ data: res, homePageList });
      addGroupMessageAndInfo({
        allGroupChats, message: { ...res, name }, groupId: res.to_group_id, groupInfo
      });
      this.props.history.push(`/group_chat/${res.to_group_id}`);
    });
  }

  openModal = () => {
    this.setState({
      showGroupModal: true
    });
  }

  cancel = () => {
    this.setState({
      showGroupModal: false
    });
  }

  _openRepository = () => {
    window.open('https://github.com/aermin/react-chat');
  }

  _showPersonalInfo = () => {
    this.setState(state => ({ showPersonalInfo: !state.showPersonalInfo }));
  }

  _showShareModal = () => {
    this.setState(state => ({ showShareModal: !state.showShareModal, showPersonalInfo: false }));
  }

  _closeShareModal = () => {
    this.setState({ showShareModal: false });
  }

  render() {
    const {
      showGroupModal, showPersonalInfo
    } = this.state;
    const { isSearching, searchFieldChange } = this.props;
    const {
      name, img, github_id, user_id
    } = this._userInfo;
    const { allGroupChatsState, homePageListState } = store.getState();
    return (
      <div className="header-wrapper">
        <UserAvatar className="myUserInfo" name={name} src={img} size="36" clickAvatar={this._showPersonalInfo} showLogo={!!github_id} />
        <PersonalInfo
          userInfo={this._userInfo}
          hide={this._showPersonalInfo}
          modalVisible={showPersonalInfo}
          showContactButton={false}
          showShareModal={this._showShareModal}
        />
        <SearchBox
          searchFieldChange={searchFieldChange}
          isSearching={isSearching}
        />
        <span className="add" onClick={this.openModal}>
          <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-add" /></svg>
        </span>
        <CreateGroupModal
          title="创建群组"
          modalVisible={showGroupModal}
          confirm={args => this.confirm(args)}
          hasCancel
          hasConfirm
          cancel={this.cancel}
         />
        <ShareModal
          title="分享此联系人给"
          modalVisible={this.state.showShareModal}
          chatId={user_id}
          cancel={this._closeShareModal}
          allGroupChats={allGroupChatsState}
          homePageList={homePageListState}
          userInfo={this._userInfo}
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
  addGroupMessageAndInfo() {}
};
