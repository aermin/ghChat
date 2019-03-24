import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GroupModal from '../GroupModal';
import notification from '../Notification';
import './style.scss';


export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      searchField: '',
    };
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  confirm = ({ groupName, groupNotice }) => {
    if (!groupName || !groupNotice) {
      notification('你有空行没填哦', 'error');
      return;
    }
    if (groupName === 'ghChat') {
      notification('这个群名仅供项目本身使用啦，请用别的群名', 'error');
      return;
    }
    this.setState({
      modalVisible: false
    });
    this.createGroup({ groupName, groupNotice });
  };

  createGroup = ({ groupName, groupNotice }) => {
    const { name, user_id } = this._userInfo;
    const data = {
      name: groupName,
      group_notice: groupNotice,
      creator: name,
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
      res.message = `${res.creator}: 创建群成功！`;
      res.time = res.create_time;
      res.from_user = res.creator_id;
      updateHomePageList({ data: res, homePageList });
      addGroupMessageAndInfo({
        allGroupChats, message: { ...res, name }, groupId: res.to_group_id, groupInfo
      });
      this.props.history.push(`/group_chat/${res.to_group_id}?name=${res.name}`);
    });
  }

  _searchFieldChange = (event) => {
    const { value } = event.target;
    const { searchFieldChange } = this.props;
    searchFieldChange(value);
  }

  openModal = () => {
    this.setState({
      modalVisible: true
    });
  }

  cancel = () => {
    this.setState({
      modalVisible: false
    });
  }

  _openRepository = () => {
    window.open('https://github.com/aermin/react-chat');
  }

  render() {
    const {
      searchField, modalVisible
    } = this.state;
    const { isSearching } = this.props;
    return (
      <div className="header-wrapper">
        <svg onClick={this._openRepository} className="icon githubIcon" aria-hidden="true">
          <use xlinkHref="#icon-github" />
        </svg>
        <div className="search-box">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-search1" />
          </svg>
          <input
            type="text"
            name="searchField"
            value={isSearching ? searchField : ''}
            placeholder="搜索用户/群"
            onChange={this._searchFieldChange} />
        </div>
        <span className="add" onClick={this.openModal}>
          <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-add" /></svg>
        </span>
        <GroupModal
          title="创建群组"
          modalVisible={modalVisible}
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
  addGroupMessageAndInfo() {}
};
