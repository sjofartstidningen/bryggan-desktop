'use strict';

const { createWindow } = require('./utils/create-window');

const filePicker = createWindow('file-picker', {
  width: 300,
  height: 350,
  title: 'File Picker',
  frame: false,
  moveable: false,
  resizable: false,
  maximizable: false,
  minimizable: false,
  fullscreenable: false,
  center: true,
  show: false,
  webPreferences: { webSecurity: true },
});

module.exports = { filePicker };
