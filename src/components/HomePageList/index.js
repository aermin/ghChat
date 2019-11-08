import React, { Component } from 'react';
import {
  withRouter,
} from 'react-router-dom';
import Fuse from 'fuse.js';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import Header from '../../containers/Header';
import './index.scss';
import ListItems from '../ListItems';
import Chat from '../../modules/Chat';

class HomePageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      contactedItems: [],
      showSearchUser: true,
      showSearchGroup: true,
      searchResultTitle: {
        user: '您联系过的用户',
        group: '您联系过的群组'
      }
    };
    this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this._filedStr = null;
    this._chat = new Chat();
    this._cleanedUnread = false;
  }

  componentDidUpdate() {
    if (this._cleanedUnread || !this.props.initializedApp) return;
    this._cleanUnreadWhenReload();
  }

  _cleanUnreadWhenReload = () => {
    const { homePageList } = this.props;
    const chatFromId = window.location.pathname.split(/^\/\S+_chat\//)[1];
    const filter = homePageList.filter(e => chatFromId && (chatFromId === e.to_group_id || chatFromId === (e.user_id && (e.user_id).toString())));
    const goal = filter[0];
    if (goal && goal.unread !== 0) {
      this._chat.clearUnreadHandle({ homePageList, chatFromId });
      this._cleanedUnread = true;
    }
  }

  searchFieldChange(field) {
    this._filedStr = field.toString();
    this.setState({
      showSearchUser: true,
      showSearchGroup: true,
      searchResultTitle: {
        user: '您联系过的用户',
        group: '您联系过的群组'
      }
    });
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
        this.setState(state => ({
          showSearchUser: false,
          searchResultTitle: { ...state.searchResultTitle, user: '所有用户' }
        }));
        data.fuzzyMatchResult.forEach((element) => {
          element.user_id = element.id;
        });
      } else {
        this.setState(state => ({
          showSearchGroup: false,
          searchResultTitle: { ...state.searchResultTitle, group: '所有群组' }
        }));
      }
      this.setState(state => ({ contactedItems: [...state.contactedItems, ...data.fuzzyMatchResult] }));
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

  render() {
    const { homePageList, allGroupChats } = this.props;
    homePageList.sort((a, b) => b.time - a.time);
    const {
      isSearching, contactedItems,
      showSearchUser, showSearchGroup,
      searchResultTitle
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
            <div className="searchResult">
              <p className="searchResultTitle">{searchResultTitle.user}</p>
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
                className="clickToSearch"
                onClick={() => this.searchInDB({ searchUser: true })}>
                网络查找相关的用户
              </p>
              )}
              <p className="searchResultTitle">{searchResultTitle.group}</p>
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
                className="clickToSearch"
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
  homePageList: PropTypes.array,
  showCallMeTip: PropTypes.func,
  initializedApp: PropTypes.bool,
};


HomePageList.defaultProps = {
  allGroupChats: new Map(),
  homePageList: [],
  showCallMeTip() {},
  initializedApp: false,
};
