import React, { PureComponent } from 'react';
import {
  withRouter,
} from 'react-router-dom';
import Fuse from 'fuse.js';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import Header from '../../containers/Header';
import './index.scss';
import ListItems from '../ListItems';
import Notification from '../../utils/notification';
import Chat from '../../modules/Chat';
// import Spinner from '../spinner';


class HomePageList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      contactedItems: [],
      showSearchUser: true,
      showSearchGroup: true,
    };
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this._filedStr = null;
    this._notification = new Notification();
    this._chat = new Chat();
    this._hasCalledMe = false;
  }

  _notificationHandle = (data) => {
    const { name, message, avatar } = data;
    const chatType = data.to_group_id ? 'group_chat' : 'private_chat';
    const chatFromId = data.to_group_id ? data.to_group_id : data.user_id;
    const title = data.to_group_id && data.groupName ? data.groupName : name;
    this._notification.notify({
      title,
      text: message,
      icon: avatar,
      onClick: () => {
        this.props.history.push(`/${chatType}/${chatFromId}?name=${title}`);
        window.focus();
        this._chat.clearUnreadHandle({ homePageList: this.props.homePageList, chatFromId });
      }
    });
  }

  subscribeSocket() {
    window.socket.removeAllListeners('getPrivateMsg');
    window.socket.removeAllListeners('getGroupMsg');
    window.socket.on('getPrivateMsg', (data) => {
      const { user_id } = this._userInfo;
      const {
        allPrivateChats, homePageList, updateHomePageList,
        addPrivateChatMessages, relatedCurrentChat
      } = this.props;
      // eslint-disable-next-line radix
      const chatId = parseInt(window.location.pathname.split('/').slice(-1)[0]);
      const isRelatedCurrentChat = (data.from_user === chatId || data.to_user === chatId);
      const increaseUnread = isRelatedCurrentChat ? 0 : 1;
      relatedCurrentChat(isRelatedCurrentChat);
      addPrivateChatMessages({
        allPrivateChats,
        message: data,
        chatId: data.from_user,
      });
      updateHomePageList({
        data, homePageList, myUserId: user_id, increaseUnread
      });
      this._notificationHandle(data);
      // TODO: mute notifications switch
    });
    window.socket.on('getGroupMsg', (data) => {
      const {
        allGroupChats, homePageList, updateHomePageList,
        addGroupMessages, relatedCurrentChat, addGroupMessageAndInfo
      } = this.props;
      // eslint-disable-next-line radix
      const chatId = window.location.pathname.split('/').slice(-1)[0];
      const isRelatedCurrentChat = (data.to_group_id === chatId);
      relatedCurrentChat(isRelatedCurrentChat);
      if (data.tip === 'joinGroup') {
        addGroupMessageAndInfo({
          allGroupChats,
          groupId: data.to_group_id,
          message: data,
          member: data,
        });
      } else {
        addGroupMessages({ allGroupChats, message: data, groupId: data.to_group_id });
      }
      if (data.message && !this._hasCalledMe) {
        const regexp = new RegExp(`@${this._userInfo.name}\\s\\S*|@${this._userInfo.name}$`);
        this._hasCalledMe = regexp.test(data.message);
      }
      updateHomePageList({
        data,
        homePageList,
        increaseUnread: isRelatedCurrentChat ? 0 : 1,
        showCallMeTip: this._hasCalledMe
      });
      this._notificationHandle(data);
      // TODO: mute notifications switch
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
    window.socket.emit('fuzzyMatch', { field: this._filedStr, searchUser }, (data) => {
      if (data.searchUser) {
        this.setState({ showSearchUser: false });
        data.fuzzyMatchResult.forEach((element) => {
          element.user_id = element.id;
        });
      } else {
        this.setState({ showSearchGroup: false });
      }
      this.setState({ contactedItems: data.fuzzyMatchResult });
    });
  }

  clickItemHandle = ({ homePageList, chatFromId }) => {
    if (this.state.isSearching) {
      this.setState({ isSearching: false });
    }
    this._chat.clearUnreadHandle({ homePageList, chatFromId });
    // clear [有人@我] [@Me]
    this.props.showCallMeTip({ homePageList, chatFromId, showCallMeTip: false });
  }

  componentWillMount() {
    this.subscribeSocket();
  }

  render() {
    const { homePageList, allGroupChats } = this.props;
    homePageList.sort((a, b) => b.time - a.time);
    const {
      isSearching, contactedItems,
      showSearchUser, showSearchGroup
    } = this.state;
    const contactedUsers = contactedItems.filter(e => (e.user_id && e.user_id !== this._userInfo.user_id));
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
              { contactedUsers.length
                ? (
                  <ListItems
                    isSearching={isSearching}
                    dataList={contactedUsers}
                    allGroupChats={allGroupChats}
                    clickItem={chatFromId => this.clickItemHandle({ homePageList, chatFromId })} />
                )
                : <p className="search-none">暂无</p>}
              { showSearchUser && (
              <p
                className="click-to-search"
                onClick={() => this.searchInDB({ searchUser: true })}>
                网络查找相关的用户
              </p>
              )}
              <p>您联系过的群组</p>
              { contactedGroups.length
                ? (
                  <ListItems
                    isSearching={isSearching}
                    dataList={contactedGroups}
                    allGroupChats={allGroupChats}
                    clickItem={chatFromId => this.clickItemHandle({ homePageList, chatFromId })} />
                )
                : <p className="search-none">暂无</p>}
              { showSearchGroup && (
              <p
                className="click-to-search"
                onClick={() => this.searchInDB({ searchUser: false })}>
                网络查找相关的群组
              </p>
              )}
            </div>
          )
            : (
              <ListItems
                dataList={homePageList}
                allGroupChats={allGroupChats}
                showRobot
                clickItem={chatFromId => this.clickItemHandle({ homePageList, chatFromId })}
                 />
            )}
        </div>
      </div>
    );
  }
}

export default withRouter(HomePageList);

HomePageList.propTypes = {
  allGroupChats: PropTypes.instanceOf(Map),
  allPrivateChats: PropTypes.instanceOf(Map),
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  addGroupMessages: PropTypes.func,
  addGroupMessageAndInfo: PropTypes.func,
  addPrivateChatMessages: PropTypes.func,
  relatedCurrentChat: PropTypes.func,
  showCallMeTip: PropTypes.func,
};


HomePageList.defaultProps = {
  allGroupChats: new Map(),
  allPrivateChats: new Map(),
  updateHomePageList() {},
  addGroupMessages() {},
  addGroupMessageAndInfo() {},
  addPrivateChatMessages() {},
  relatedCurrentChat() {},
  homePageList: [],
  showCallMeTip() {},
};
