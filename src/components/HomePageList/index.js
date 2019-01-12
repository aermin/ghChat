import React, { PureComponent } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toNormalTime } from '../../utils/transformTime';
// import Spinner from '../spinner';

export default class HomePageList extends PureComponent {
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
    const listItems = homePageList.map((data, index) => (
      <li key={index}>
        <Link to={data.to_group_id ? `/group_chat/${data.to_group_id}` : `/private_chat/${data.user_id}`}>
          <img src={data.avatar} alt={data.to_group_id ? '群头像' : '用户头像'} className="img" />
          {/* {data.unread &&<span className={data.type === 'group' ? "group-unread" :"private-unread" }>{data.unread}</span>} */}
          <div className="content">
            <div className="title">
              {data.name}
              <span>{toNormalTime(data.time)}</span>
            </div>
            <div className="message">{data.message || '暂无消息'}</div>
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
