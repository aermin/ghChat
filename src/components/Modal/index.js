import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import ModalBase from '../ModalBase';

function confirmCancelRender(props) {
  const { hasCancel, hasConfirm, confirm, cancel } = props;
  if (hasCancel && hasConfirm) {
    return (
      <div className="twoButton">
        <p onClick={cancel}>取消</p>
        <p onClick={confirm}>确定</p>
      </div>
    );
  }
  if (hasConfirm || hasCancel) {
    return (
      <div className="oneButton">
        {hasCancel && <p onClick={cancel}>取消</p>}
        {hasConfirm && <p onClick={confirm}>确定</p>}
      </div>
    );
  }
  return null;
}

confirmCancelRender.propTypes = {
  hasCancel: PropTypes.bool,
  hasConfirm: PropTypes.bool,
  cancel: PropTypes.func, // 点击遮罩取消Modal的前提是有传cancel方法
  confirm: PropTypes.func,
};

confirmCancelRender.defaultProps = {
  hasCancel: false,
  hasConfirm: false,
  cancel: undefined,
  confirm: undefined,
};

function dialogRender(props) {
  const { title, children } = props;
  return (
    <div className="dialogRender">
      <h3 className="title">{title}</h3>
      {children}
      {confirmCancelRender({ ...props })}
    </div>
  );
}

dialogRender.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

dialogRender.defaultProps = {
  title: '',
  children: undefined,
};

const ModalDialogRender = ModalBase(dialogRender);
// TODO: （refactor）take thinner component
export default function Modal(props) {
  return <ModalDialogRender {...props} />;
}
