import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';


export default class Modal extends Component {
    clickCancel = () => {
      const { cancel } = this.props;
      cancel();
    }

    clickConfirm = () => {
      const { confirm } = this.props;
      confirm();
    }

    render() {
      const {
        visible, title, hasCancel, children
      } = this.props;
      return (
        <div>
          {visible && (
            <div className="modal">
              <div className="bg" />
              <div className="modal-wrapper">
                <h1>
                  {title}
                </h1>
                {/* <p className="content">
                  {content}
                </p> */}
                {children}
                {hasCancel ? (
                  <div className="hasCancel">
                    <p onClick={this.clickCancel}>取消</p>
                    <p onClick={this.clickConfirm}>确定</p>
                  </div>) : (
                    <div className="noCancel">
                      <p onClick={this.clickConfirm}>确定</p>
                    </div>)
                }
              </div>
            </div>
          )}
        </div>
      );
    }
}

Modal.propTypes = {
  cancel: PropTypes.func,
  confirm: PropTypes.func,
  visible: PropTypes.bool,
  title: PropTypes.string,
  hasCancel: PropTypes.bool,
  children: PropTypes.node,
};


Modal.defaultProps = {
  cancel: undefined,
  confirm: undefined,
  visible: false,
  title: '',
  hasCancel: false,
  children: undefined,
};
