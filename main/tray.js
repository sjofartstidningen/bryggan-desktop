'use strict';

const { Tray } = require('electron');
const { filePicker } = require('./file-picker');
const { trayMenu } = require('./menus');
const { getIcon } = require('./utils/icons.js');
const { minutes } = require('./utils/time');
const { productName, version } = require('../package.json');

let tray = null;

function initializeTray() {
  tray = new Tray(getIcon('trayIconTemplate.png'));

  tray.setToolTip(`${productName} v${version}`);

  tray.on('click', () => filePicker.toggle());
  tray.on('right-click', () => tray.popUpContextMenu(trayMenu));

  filePicker.on('blur', () => {
    const win = filePicker.getWindow();
    if (!win.webContents.isDevToolsFocused()) filePicker.toggle();
  });

  filePicker.on('show', () => tray.setHighlightMode('always'));
  filePicker.on('hide', () => tray.setHighlightMode('never'));

  let timeout = null;
  filePicker.on('show', () => clearTimeout(timeout));
  filePicker.on('hide', () => {
    clearTimeout(timeout);
    timeout = setTimeout(filePicker.close, minutes(15).toMilliseconds());
  });
}

module.exports = { initializeTray };
