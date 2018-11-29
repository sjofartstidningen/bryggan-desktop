'use strict';

const path = require('path');
const { app } = require('electron');
const prepareNext = require('electron-next');
const { initializeTray } = require('./tray');
const { installDevTools } = require('./utils/dev-tools');

(async () => {
  await app.whenReady();
  app.dock.hide();

  await Promise.all([
    prepareNext(path.join(__dirname, '../renderer')),
    installDevTools(),
  ]);

  initializeTray();
})();

app.on('window-all-closed', event => event.preventDefault());
