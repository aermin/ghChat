// 感谢 https://www.npmjs.com/package/react-user-avatar
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

const defaultColors = [
  '#2ecc71', // emerald
  '#3498db', // peter river
  '#8e44ad', // wisteria
  '#e67e22', // carrot
  '#e74c3c', // alizarin
  '#1abc9c', // turquoise
  '#2c3e50', // midnight blue
];

function sumChars(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i += 1) {
    sum += str.charCodeAt(i);
  }

  return sum;
}

// eslint-disable-next-line react/prefer-stateless-function
export default function UserAvatar(props) {
  const {
    src,
    name,
    isGray,
    color,
    colors = defaultColors,
    clickAvatar,
    size,
    borderRadius,
    showLogo,
    className,
  } = props;

  const innerStyle = {
    textAlign: 'center',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius,
    lineHeight: `${size}px`,
    color: 'white',
    display: 'inline-block',
  };

  const imgStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius,
  };

  let inner;
  if (src) {
    inner = <img style={imgStyle} src={src} alt={name} />;
  } else {
    let background;
    if (color) {
      background = color;
    } else {
      // pick a deterministic color from the list
      const i = sumChars(name) % colors.length;
      background = colors[i];
    }

    innerStyle.backgroundColor = background;

    inner = <span>{name.charAt(0)}</span>;
  }

  return (
    <div
      className={classnames(className, isGray ? 'userAvatar gray' : 'userAvatar')}
      style={innerStyle}
      onClick={clickAvatar}
    >
      {showLogo && (
        <svg className="icon viaGithub" aria-hidden="true">
          <use xlinkHref="#icon-github" />
        </svg>
      )}
      {inner}
    </div>
  );
}

UserAvatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  isGray: PropTypes.bool,
  color: PropTypes.string,
  colors: PropTypes.array,
  clickAvatar: PropTypes.func,
  size: PropTypes.string,
  borderRadius: PropTypes.string,
  showLogo: PropTypes.bool,
  className: PropTypes.string,
};

UserAvatar.defaultProps = {
  src: undefined,
  name: '?',
  isGray: false,
  color: undefined,
  colors: defaultColors,
  clickAvatar: undefined,
  size: '40',
  borderRadius: '50%',
  showLogo: false,
  className: undefined,
};
