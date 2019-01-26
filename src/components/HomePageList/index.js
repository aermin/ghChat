import React, { PureComponent } from 'react';
import Fuse from 'fuse.js';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import Header from '../Header';
import './index.scss';
import ListItems from '../ListItems';
// import Spinner from '../spinner';

export default class HomePageList extends PureComponent {
  constructor() {
    super();
    this.state = {
      isSearching: false,
      contactedItems: [],
      showSearchUser: true,
      showSearchGroup: true,
    };
    this._filedStr = null;
  }

  subscribeSocket() {
    window.socket.removeAllListeners('getPrivateMsg');
    window.socket.removeAllListeners('getGroupMsg');
    window.socket.on('getPrivateMsg', (data) => {
      console.log('subscribeSocket for private chat', data);
      const fromUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const {
        allChatContent, homePageList, updateHomePageList,
        updateAllChatContent, relatedCurrentChat
      } = this.props;
      // eslint-disable-next-line radix
      const chatId = parseInt(window.location.pathname.split('/').slice(-1)[0]);
      const isRelatedCurrentChat = (data.from_user === chatId || data.to_user === chatId);
      console.log('isRelatedCurrentChat, data.from_user, data.to_user, chatId', isRelatedCurrentChat, data.from_user, data.to_user, chatId);
      relatedCurrentChat(isRelatedCurrentChat);
      updateAllChatContent({ allChatContent, newChatContent: data, action: 'get' });
      updateHomePageList({ data, homePageList, myUserId: fromUserInfo.userId });
    });
    window.socket.on('getGroupMsg', (data) => {
      console.log('subscribeSocket for group chat', data);
      const {
        allChatContent, homePageList, updateHomePageList,
        updateAllChatContent, relatedCurrentChat
      } = this.props;
      // eslint-disable-next-line radix
      const chatId = window.location.pathname.split('/').slice(-1)[0];
      const isRelatedCurrentChat = (data.to_group_id === chatId);
      console.log('isRelatedCurrentChat, data.to_group_id, chatId', isRelatedCurrentChat, data.to_group_id, chatId);
      relatedCurrentChat(isRelatedCurrentChat);
      updateAllChatContent({ allChatContent, newChatContent: data });
      updateHomePageList({ data, homePageList });
    });
  }

  searchFieldChange(field) {
    this._filedStr = field.toString();
    this.setState({ showSearchUser: true, showSearchGroup: true });
    if (this._filedStr.length > 0) {
      const { homePageList } = this.props;
      const homePageListCopy = [...List(homePageList)];
      const fuse = new Fuse(homePageListCopy, this.filterOptions);
      const contactedItems = fuse.search(this._filedStr);
      this.setState({ isSearching: true, contactedItems });
    } else {
      this.setState({ isSearching: false });
    }
  }

  get filterOptions() {
    const options = {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'name',
      ]
    };
    return options;
  }

  searchInDB({ searchUser }) {
    console.log('this._filedStr', this._filedStr);
    window.socket.emit('fuzzyMatch', { field: this._filedStr, searchUser });
    window.socket.on('fuzzyMatchRes', (data) => {
      console.log(data);
      const { contactedItems } = this.state;
      if (data.searchUser) {
        this.setState({ showSearchUser: false });
        data.fuzzyMatchResult.forEach((element) => {
          element.user_id = element.id;
        });
      } else {
        this.setState({ showSearchGroup: false });
      }
      this.setState({ contactedItems: data.fuzzyMatchResult });
      console.log('contactedItems', contactedItems);
    });
  }

  clickItem() {
    this.setState({ isSearching: false });
  }

  componentWillMount() {
    console.log('home page list props', this.props);
    const fromUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    window.socket.emit('initGroupChat', { userId: fromUserInfo.userId });
    this.subscribeSocket();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount in homePageList');
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps in homePageList', nextProps, this.props);
  }

  render() {
    const { homePageList } = this.props;
    homePageList.sort((a, b) => b.time - a.time);
    const {
      isSearching, contactedItems, showSearchUser, showSearchGroup
    } = this.state;
    console.log('contactedItems, showSearchUser, showSearchGroup', contactedItems, showSearchUser, showSearchGroup);
    const contactedUsers = contactedItems.filter(e => e.user_id);
    const contactedGroups = contactedItems.filter(e => e.to_group_id);
    return (
      <div className="home-page-list-wrapper">
        <Header searchFieldChange={field => this.searchFieldChange(field)} isSearching={isSearching} />
        <div className="home-page-list-content">
          {/* TODO */}
          {/* {this.state.showSpinner && <Spinner /> } */}
          {isSearching ? (
            <div className="search-result">
              <p>您联系过的用户</p>
              { contactedUsers.length ? <ListItems dataList={contactedUsers} clickItem={() => this.clickItem()} /> : <p className="search-none">暂无</p>}
              { showSearchUser && <p className="click-to-search" onClick={() => this.searchInDB({ searchUser: true })}>网络查找相关的用户</p>}
              <p>您联系过的群组</p>
              { contactedGroups.length ? <ListItems dataList={contactedGroups} clickItem={() => this.clickItem()} /> : <p className="search-none">暂无</p>}
              { showSearchGroup && <p className="click-to-search" onClick={() => this.searchInDB({ searchUser: false })}>网络查找相关的群组</p>}
            </div>
          )
            : <ListItems dataList={homePageList} />}
        </div>
      </div>
    );
  }
}

HomePageList.propTypes = {
  allChatContent: PropTypes.object,
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  updateAllChatContent: PropTypes.func,
  relatedCurrentChat: PropTypes.func,
};


HomePageList.defaultProps = {
  allChatContent: {},
  homePageList: [],
  updateHomePageList: undefined,
  updateAllChatContent: undefined,
  relatedCurrentChat: undefined,
};
