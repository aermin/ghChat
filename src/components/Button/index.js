import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './styles.scss';

export default function Button({ clickFn, value, className }) {
  return (
    <input
      type="button"
      onClick={clickFn}
      className={classnames('baseButton', className)}
      value={value}
    />
  );
}

Button.propTypes = {
  clickFn: PropTypes.func,
  value: PropTypes.string,
  className: PropTypes.string,
};


Button.defaultProps = {
  clickFn: undefined,
  value: '',
  className: undefined,
};
