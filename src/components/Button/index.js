import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

export default function Button({ clickFn, value }) {
  return (
    <input
      type="button"
      onClick={clickFn}
      className="baseButton"
      value={value}
              />
  );
}

Button.propTypes = {
  clickFn: PropTypes.func,
  value: PropTypes.string,
};


Button.defaultProps = {
  clickFn: undefined,
  value: ''
};
