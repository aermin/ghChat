import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import './style.scss';

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: {},
      groupName: '',
      groupNotice: '',
      modalVisible: false,
      searchField: ''
    };
  }

  componentWillMount() {
    this.setState({
      userInfo: JSON.parse(localStorage.getItem('userInfo'))
    });
  }

  confirm = () => {
    this.setState({
      modalVisible: false
    });
    this.createGroup();
  };

  createGroup = () => {
    console.log('createGroup');
    const { groupName, groupNotice } = this.state;
    const { name, userId } = JSON.parse(localStorage.getItem('userInfo'));
    const data = {
      name: groupName,
      group_notice: groupNotice,
      creator: name,
      creator_id: userId,
      create_time: Date.parse(new Date()) / 1000
    };
    // this.props.history.push('/login');
    window.socket.on('createGroupRes', (data) => {
      console.log('createGroupRes', data);
      const {
        updateAllChatContent, updateHomePageList, homePageList, allChatContent,
      } = this.props;
      const groupInfo = Object.assign({}, data);
      data.message = `${data.creator}: 创建群成功！`;
      data.time = Date.parse(new Date()) / 1000;
      updateHomePageList({ data, homePageList });
      const newChatContents = {
        messages: [{ ...data, name }],
        groupInfo
      };
      updateAllChatContent({ allChatContent, newChatContents });
      this.props.history.push(`/group_chat/${data.to_group_id}`);
    });
    window.socket.emit('createGroup', data);
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
    console.log('openModal');
    this.setState({
      modalVisible: true
    });
  }

  cancel = () => {
    this.setState({
      modalVisible: false
    });
  }

  render() {
    const {
      userInfo, groupName, groupNotice, searchField, modalVisible
    } = this.state;
    const { isSearching } = this.props;
    return (
      <div className="header-wrapper">
        <img src={userInfo.avatar} alt="" />
        <div className="search-box">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-search1" />
          </svg>
          <input type="text" name="searchField" value={isSearching ? searchField : ''} placeholder="搜索用户/群" onChange={this.handleChange} />
        </div>
        <span className="add" onClick={this.openModal}>
          <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-add" /></svg>
        </span>
        <Modal
          title="创建群组"
          visible={modalVisible}
          confirm={this.confirm}
          hasCancel
          cancel={this.cancel}
        >
          <div className="content">
            <p>
              <span>群名:</span>
              <input name="groupName" value={groupName} onChange={this.handleChange} type="text" placeholder="不超过10个字哦" maxLength="10" />
            </p>
            <p>
              <span>群公告:</span>
              <textarea name="groupNotice" value={groupNotice} onChange={this.handleChange} rows="3" type="text" placeholder="不超过60个字哦" maxLength="60" />
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}

Header.propTypes = {
  updateHomePageList: PropTypes.func,
  updateAllChatContent: PropTypes.func,
  homePageList: PropTypes.array,
  allChatContent: PropTypes.object,
  searchFieldChange: PropTypes.func,
};


Header.defaultProps = {
  updateHomePageList: undefined,
  updateAllChatContent: undefined,
  homePageList: [],
  allChatContent: {},
  searchFieldChange: undefined
};
