// thanks => https://codepen.io/Navedkhan012/pen/vrWQMY

import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

export default function NotFound() {
  return (
    <section className="page404">
      <div className="container">
        <div className="fourZeroFourBg">
          <h1>404</h1>
        </div>
        <div className="contentBox">
          <p>你所访问的页面不存在</p>
          <Link className="link" to="/">
            返回首页
          </Link>
        </div>
      </div>
    </section>
  );
}
