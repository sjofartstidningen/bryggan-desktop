'use strict';

const { app, BrowserWindow } = require('electron');
const prepareNext = require('electron-next');
const { loadRoute } = require('./utils/routes');

(async () => {
  await app.whenReady();
  await prepareNext('./renderer');

  const win = new BrowserWindow({
    width: 300,
    height: 350,
    show: true,
    frame: false,
    resizable: false,
    webPreferences: {},
  });

  loadRoute(win, 'main');
})();

app.on('window-all-closed', event => event.preventDefault());
