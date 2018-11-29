'use strict';

const path = require('path');
const { Tray } = require('electron');
const { filePicker } = require('./file-picker');
const { trayMenu } = require('./menus');

let tray = null;

function initializeTray() {
  const iconPath = path.join(__dirname, '../static/trayIconTemplate.png');
  tray = new Tray(iconPath);

  tray.on('click', () => filePicker.toggle());
  tray.on('right-click', () => tray.popUpContextMenu(trayMenu));
}

module.exports = { initializeTray };
