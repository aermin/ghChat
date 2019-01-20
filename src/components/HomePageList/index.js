import React, { PureComponent } from 'react';
import Fuse from 'fuse.js';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
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
    };
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
    const filedStr = field.toString();
    if (filedStr.length > 0) {
      const { homePageList } = this.props;
      const homePageListCopy = [...List(homePageList)];
      const fuse = new Fuse(homePageListCopy, this.filterOptions);
      const contactedItems = fuse.search(filedStr);
      console.log('contactedItems', contactedItems);
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
    const { isSearching, contactedItems } = this.state;
    return (
      <div className="home-page-list-wrapper">
        <Header searchFieldChange={field => this.searchFieldChange(field)} />
        {/* TODO */}
        {/* {this.state.showSpinner && <Spinner /> } */}
        {isSearching ? <ListItems dataList={contactedItems} />
          : <ListItems dataList={homePageList} />}
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
