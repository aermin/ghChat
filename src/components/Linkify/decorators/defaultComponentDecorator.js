import * as React from 'react';

export default (decoratedHref, decoratedText, key, target = '_blank') => (
  <a href={decoratedHref} key={key} target={target}>
    {decoratedText}
  </a>
);
