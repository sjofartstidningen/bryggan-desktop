'use strict';

const path = require('path');
const { Tray } = require('electron');
const { toggleFilePicker } = require('./file-picker');
const { trayMenu } = require('./menus');

let tray = null;

function initializeTray() {
  const iconPath = path.join(__dirname, '../static/trayIconTemplate.png');
  tray = new Tray(iconPath);

  tray.on('click', toggleFilePicker);
  tray.on('right-click', () => tray.popUpContextMenu(trayMenu));
}

module.exports = { initializeTray };
