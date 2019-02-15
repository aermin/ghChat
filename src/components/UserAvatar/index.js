// 感谢 https://www.npmjs.com/package/react-user-avatar
import React, { Component } from 'react';

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
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }

  return sum;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class UserAvatar extends Component {
  render() {
    const {
      src,
      name,
      color,
      colors = defaultColors,
      onClick,
      size = '40',
      borderRadius = '50%',
    } = this.props;

    if (!name) throw new Error('UserAvatar requires a name');

    const innerStyle = {
      textAlign: 'center',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius,
      lineHeight: `${size}px`,
      color: 'white'
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

      inner = name.charAt(0);
    }

    return (
      <div className="UserAvatar" style={innerStyle}>
        {inner}
      </div>
    );
  }
}
