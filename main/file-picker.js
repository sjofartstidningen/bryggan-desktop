'use strict';

const { BrowserWindow } = require('electron');
const { loadRoute } = require('./utils/routes');
const { windows } = require('./utils/cache');

const closeExistingFilePicker = () => {
  if (windows.has('file-picker')) {
    const oldWin = windows.get('file-picker');
    oldWin.destroy();
    windows.delete('file-picker');
  }
};

function openFilePicker() {
  closeExistingFilePicker();

  const filePicker = new BrowserWindow({
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
    webPreferences: {
      preload: require.resolve('./utils/preload.js'),
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  windows.set('file-picker', filePicker);
  loadRoute(filePicker, 'file-picker');

  filePicker.webContents.on('did-finish-load', () => {
    filePicker.show();
    filePicker.focus();
  });

  filePicker.on('closed', closeExistingFilePicker);
  filePicker.on('blur', () => {
    if (!filePicker.webContents.isDevToolsFocused()) {
      closeExistingFilePicker();
    }
  });
}

module.exports = { openFilePicker };
