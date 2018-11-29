'use strict';

const path = require('path');
const { Tray, nativeImage } = require('electron');
const { openFilePicker } = require('./file-picker');

let tray = null;

function initializeTray() {
  const iconPath = path.join(__dirname, '../static/trayIconTemplate.png');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);

  tray.on('click', openFilePicker);
}

module.exports = { initializeTray };
