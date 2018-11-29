import React, { ConcurrentMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const rootEl = document.getElementById('root');
ReactDOM.render(
  <ConcurrentMode>
    <App />
  </ConcurrentMode>,
  document.getElementById('root'),
);
