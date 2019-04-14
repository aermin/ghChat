import React, { Component } from 'react';
import {
  withRouter,
} from 'react-router-dom';
import Fuse from 'fuse.js';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import './styles.scss';
import notification from '../Notification';
import Modal from '../Modal';
import SearchBox from '../SearchBox';
import ListItems from '../ListItems';


class InviteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      contactedItems: [],
    };
  }

  _copyInviteLink = () => {
    const dummy = document.createElement('input');
    const text = `${window.location.origin}${window.location.pathname}`;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    notification('你已复制了邀请链接，请发给外部的人吧', 'success');
  }

  searchFieldChange(field) {
    this._filedStr = field.toString();
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

  _clickItemHandle = () => {
    const { clickInviteModalItem, homePageList, chatId } = this.props;
    clickInviteModalItem({ chatId, homePageList });
  }

  render() {
    const {
      title, modalVisible, cancel, allGroupChats, homePageList
    } = this.props;
    const { isSearching, contactedItems } = this.state;
    return (
      <Modal
        title={title}
        visible={modalVisible}
        cancel={cancel}
        modalWrapperClassName="inviteModalWrapper"
        >
        <SearchBox
          searchFieldChange={value => this.searchFieldChange(value)}
          isSearching={this.state.isSearching}
        />
        <ListItems
          dataList={isSearching ? contactedItems : homePageList}
          allGroupChats={allGroupChats}
          showAsContacts
          clickItem={chatFromId => this._clickItemHandle(chatFromId)}
        />
        <div className="shareInviteLink" onClick={this._copyInviteLink}>
          <svg className="icon shareIcon" aria-hidden="true"><use xlinkHref="#icon-share1" /></svg>
          复制链接分享给应用外的人
        </div>
      </Modal>
    );
  }
}

export default withRouter(InviteModal);

InviteModal.propTypes = {
  clickInviteModalItem: PropTypes.func,
  homePageList: PropTypes.array,
  allGroupChats: PropTypes.instanceOf(Map),
  modalVisible: PropTypes.bool,
  cancel: PropTypes.func,
  chatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};


InviteModal.defaultProps = {
  clickInviteModalItem() {},
  homePageList: [],
  allGroupChats: new Map(),
  modalVisible: false,
  cancel() {},
  chatId: null,
};