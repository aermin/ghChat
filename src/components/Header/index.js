import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import notification from '../Notification';
import './style.scss';


export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      groupName: '',
      groupNotice: '',
      modalVisible: false,
      searchField: '',
    };
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  confirm = () => {
    const { groupName, groupNotice } = this.state;
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
    this.createGroup();
  };

  createGroup = () => {
    const { groupName, groupNotice } = this.state;
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

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    if (name === 'searchField') {
      const { searchFieldChange } = this.props;
      searchFieldChange(value);
    }
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
      groupName, groupNotice,
      searchField, modalVisible,
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
            onChange={this.handleChange} />
        </div>
        <span className="add" onClick={this.openModal}>
          <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-add" /></svg>
        </span>
        <Modal
          title="创建群组"
          visible={modalVisible}
          confirm={this.confirm}
          hasCancel
          hasConfirm
          cancel={this.cancel}
        >
          <div className="content">
            <p>
              <span>群名:</span>
              <input
                name="groupName"
                value={groupName}
                onChange={this.handleChange}
                type="text"
                placeholder="不超过12个字哦"
                maxLength="12" />
            </p>
            <p>
              <span>群公告:</span>
              <textarea
                name="groupNotice"
                value={groupNotice}
                onChange={this.handleChange}
                rows="3"
                type="text"
                placeholder="不超过60个字哦"
                maxLength="60" />
            </p>
          </div>
        </Modal>
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
