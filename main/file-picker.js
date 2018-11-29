'use strict';

const { BrowserWindow } = require('electron');
const ipc = require('electron-better-ipc');
const { loadRoute } = require('./utils/routes');
const { windows } = require('./utils/cache');

const closeExistingFilePicker = () => {
  if (windows.has('file-picker')) {
    const oldWin = windows.get('file-picker');
    oldWin.destroy();
    windows.delete('file-picker');
  }
};

function createFilePicker() {
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
      nodeIntegration: true,
      webSecurity: true,
    },
  });

  windows.set('file-picker', filePicker);
  loadRoute(filePicker, 'file-picker');

  ipc.answerRenderer('file-picker-ready', () => filePicker.show());

  filePicker.on('closed', closeExistingFilePicker);

  filePicker.on('blur', () => {
    if (!filePicker.webContents.isDevToolsFocused()) {
      closeExistingFilePicker();
    }
  });
}

const openFilePicker = () => {
  closeExistingFilePicker();
  createFilePicker();
};

const toggleFilePicker = () => {
  if (!windows.has('file-picker')) {
    createFilePicker();
  } else {
    const filePicker = windows.get('file-picker');
    if (filePicker.isVisible()) {
      closeExistingFilePicker();
    } else {
      filePicker.show();
      filePicker.focus();
    }
  }
};

module.exports = { createFilePicker, openFilePicker, toggleFilePicker };
