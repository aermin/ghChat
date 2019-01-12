import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import './style.scss';

const SearchBox = () => (
  <div className="search-box">
    <svg className="icon" aria-hidden="true">
      <use xlinkHref="#icon-search1" />
    </svg>
    <input type="text" placeholder="搜索用户/群" />
  </div>
);

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: {},
      groupName: '',
      groupNotice: '',
      modal: {
        visible: false,
      }
    };
  }

  componentWillMount() {
    this.setState({
      userInfo: JSON.parse(localStorage.getItem('userInfo'))
    });
  }

  confirm = () => {
    this.setState({
      visible: false
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
      data.message = `${data.creator}: 创建群成功！`;
      data.time = Date.parse(new Date()) / 1000;
      console.log('updateHomePageList~~', this.props);
      updateHomePageList({ data, homePageList });
      updateAllChatContent({ allChatContent, newChatContent: data });
      // eslint-disable-next-line react/prop-types
      this.props.history.push(`/group_chat/${data.to_group_id}`);
    });
    window.socket.emit('createGroup', data);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    console.log('this.state', this.state);
  }

  openModal = () => {
    console.log('openModal');
    this.setState({
      visible: true
    });
  }

  cancel = () => {
    this.setState({
      visible: false
    });
  }

  render() {
    const {
      userInfo, groupName, groupNotice
    } = this.state;
    return (
      <div className="header-wrapper">
        <img src={userInfo.avatar} alt="" />
        <SearchBox />
        <span className="add" onClick={this.openModal}>
          <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-add" /></svg>
        </span>
        <Modal
          title="创建群组"
          visible={this.state.visible}
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
};


Header.defaultProps = {
  updateHomePageList: undefined,
  updateAllChatContent: undefined,
  homePageList: [],
  allChatContent: {},
};
