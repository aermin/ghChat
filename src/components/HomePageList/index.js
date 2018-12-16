import React, { PureComponent } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toNomalTime } from '../../utils/transformTime';
import Spinner from '../spinner';

export default class HomePageList extends PureComponent {
  // TODO: getMsgOnSocket

  subscribeSocket() {
    socket.removeAllListeners('getPrivateMsg');
    socket.on('getPrivateMsg', (data) => {
      console.log('subscribeSocket for private chat', data);
      const fromUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const {
        allChatContent, homePageList, updateHomePageList,
        updateAllChatContentByGot, relatedCurrentChat
      } = this.props;
      // eslint-disable-next-line radix
      const chatId = parseInt(window.location.pathname.split('/').slice(-1)[0]);
      const isRelatedCurrentChat = (data.from_user === chatId || data.to_user === chatId);
      relatedCurrentChat(isRelatedCurrentChat);
      updateAllChatContentByGot({ allChatContent, newChatContent: data, chatType: 'privateChat' });
      updateHomePageList({ data, homePageList, myUserId: fromUserInfo.user_id });
    });
    socket.on('getGroupMsg', () => {
      console.log('subscribeSocket for group chat');
    });
  }

  componentWillMount() {
    console.log('home page list props', this.props);
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
    const listItems = homePageList.map((data, index) => (
      <li key={index}>
        <Link to={data.type === 'group' ? `/group_chat/${data.group_id}` : `/private_chat/${data.from_user}`}>
          <img src={data.type === 'group' ? data.group_avator : data.avator} alt={data.type === 'group' ? '群头像' : '用户头像'} className="img" />
          {/* {data.unread &&<span className={data.type === 'group' ? "group-unread" :"private-unread" }>{data.unread}</span>} */}
          <div className="content">
            <div className="title">
              {data.type === 'group' ? data.group_name : data.name}
              <span>{toNomalTime(data.time)}</span>
            </div>
            <div className="message">{data.message}</div>
          </div>
        </Link>
      </li>
    ));
    return (
      <div className="home-page-list-wrapper">
        {/* TODO */}
        {/* {this.state.showSpinner && <Spinner /> } */}
        <ul>{listItems}</ul>
      </div>
    );
  }
}

HomePageList.propTypes = {
  allChatContent: PropTypes.object,
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  updateAllChatContentByGot: PropTypes.func,
  relatedCurrentChat: PropTypes.func,
};


HomePageList.defaultProps = {
  allChatContent: {},
  homePageList: [],
  updateHomePageList: undefined,
  updateAllChatContentByGot: undefined,
  relatedCurrentChat: undefined,
};
