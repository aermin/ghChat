import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ShareModal from '../ShareModal';

class ShareChatCard extends Component {
  state = {
    showShareModal: false,
  };

  _showShareModal = () => {
    this.props.hideOtherModal();
    this.setState(state => ({ showShareModal: !state.showShareModal }));
  };

  _closeShareModal = () => {
    this.setState({ showShareModal: false });
  };

  render() {
    const { allGroupChats, homePageList, title, chatId } = this.props;
    return (
      <div>
        <svg onClick={this._showShareModal} className="icon shareIcon" aria-hidden="true">
          <use xlinkHref="#icon-share" />
        </svg>
        <ShareModal
          title={title}
          modalVisible={this.state.showShareModal}
          chatId={chatId}
          cancel={this._closeShareModal}
          allGroupChats={allGroupChats}
          homePageList={homePageList}
        />
      </div>
    );
  }
}

export default ShareChatCard;

ShareChatCard.propTypes = {
  title: PropTypes.string,
  allGroupChats: PropTypes.instanceOf(Map),
  homePageList: PropTypes.array,
  chatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hideOtherModal: PropTypes.func,
};

ShareChatCard.defaultProps = {
  title: '',
  allGroupChats: new Map(),
  homePageList: [],
  chatId: null,
  hideOtherModal() {},
};
