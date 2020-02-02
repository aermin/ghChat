import React from 'react';
import getRouter from './router';
import './app.scss';

export default function App() {
  return <div>{getRouter()}</div>;
}
