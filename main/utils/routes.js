'use strict';

const { app } = require('electron');
const { is } = require('electron-util');

const loadRoute = (win, routeName) => {
  if (is.development) {
    win.loadURL(`http://localhost:8000/${routeName}`);
    win.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(`${app.getAppPath()}/renderer/out/${routeName}/index.html`);
  }
};

module.exports = { loadRoute };
