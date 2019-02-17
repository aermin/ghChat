import React from 'react';
import './styles.scss';

function ModalBase(Comp) {
  return (props) => {
    const { visible = false, cancel } = props;
    return (
      <div>
        {visible && (
        <div className="modal">
          <div onClick={cancel} className="mask" />
          <div className="modalWrapper">
            {cancel && <span onClick={cancel} className="xIcon">x</span>}
            <Comp {...props} />
          </div>
        </div>
        )}
      </div>
    );
  };
}

export default ModalBase;
