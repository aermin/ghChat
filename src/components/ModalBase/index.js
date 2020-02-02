import React from 'react';
import './styles.scss';
import classnames from 'classnames';

function ModalBase(Comp) {
  return props => {
    const { visible = false, cancel, modalWrapperClassName } = props;
    return (
      <div className={classnames('modal', visible ? 'showModalBase' : 'hideModalBase')}>
        <div onClick={cancel} className="mask" />
        <div className={classnames('modalWrapper', modalWrapperClassName)}>
          {cancel && (
            <span onClick={cancel} className="xIcon">
              x
            </span>
          )}
          <Comp {...props} />
        </div>
      </div>
    );
  };
}

export default ModalBase;
