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
import Chat from '../../modules/Chat';
// import Spinner from '../Spinner';


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
    this._chat = new Chat();
  }

  componentWillMount() {
    this.props.subscribeSocket();
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
  homePageList: PropTypes.array,
  showCallMeTip: PropTypes.func,
  subscribeSocket: PropTypes.func,
};


HomePageList.defaultProps = {
  allGroupChats: new Map(),
  homePageList: [],
  showCallMeTip() {},
  subscribeSocket() {},
};
