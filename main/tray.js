'use strict';

const path = require('path');
const { Tray } = require('electron');
const { toggleFilePicker } = require('./file-picker');

let tray = null;

function initializeTray() {
  const iconPath = path.join(__dirname, '../static/trayIconTemplate.png');
  tray = new Tray(iconPath);

  tray.on('click', toggleFilePicker);
}

module.exports = { initializeTray };
