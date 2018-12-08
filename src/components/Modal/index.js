import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';


export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

    cancel = () => {
      const { modalEvent, cancel } = this.props;
      cancel(modalEvent);
    }

    confirm = () => {
      const { modalEvent, confirm } = this.props;
      confirm(modalEvent);
    }

    render() {
      const {
        visible, title, content, hasCancel
      } = this.props;
      return (
        <div>
          {visible && (
            <div className="modal">
              <div className="bg" />
              <div className="modal-wrapper">
                <h1>
                  {' '}
                  {title}
                  {' '}
                </h1>
                <p className="content">
                  {content}
                </p>
                {hasCancel ? (
                  <div className="hasCancel">
                    <p onClick={this.cancel}>取消</p>
                    <p onClick={this.confirm}>确定</p>
                  </div>) : (
                    <div className="noCancel">
                      <p onClick={this.confirm}>确定</p>
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
  modalEvent: PropTypes.string,
  cancel: PropTypes.func,
  confirm: PropTypes.func,
  visible: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  hasCancel: PropTypes.bool
};


Modal.defaultProps = {
  modalEvent: undefined,
  cancel: undefined,
  confirm: undefined,
  visible: false,
  title: '',
  content: '',
  hasCancel: false,
};
