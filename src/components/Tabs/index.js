import React, { Component } from 'react';
import {
  withRouter,
  Link
} from 'react-router-dom';
import PropTypes from 'prop-types';
import './style.scss';

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { match } = this.props;
    return (
      <div className="tabs-wrapper">
        <div className="tab tab-one">
          <Link to="/">
            <svg className="icon " aria-hidden="true">
              <use xlinkHref={match.url === '/' ? '#icon-messagefill' : '#icon-message1'} />
            </svg>
          </Link>
        </div>
        <div className="tab tab-two">
          <Link to="/contact">
            <svg className="icon " aria-hidden="true">
              <use xlinkHref={match.url === '/contact' ? '#icon-group_fill' : '#icon-group'} />
            </svg>
          </Link>
        </div>
        <div className="tab tab-three">
          <Link to="/robot">
            <svg className="icon " aria-hidden="true">
              <use xlinkHref={match.url === '/robot' ? '#icon-zhinengfenxi1' : '#icon-zhinenghua'} />
            </svg>
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Tabs);


Tabs.propTypes = {
  match: PropTypes.object,
};


Tabs.defaultProps = {
  match: { url: '/' }
};
