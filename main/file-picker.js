import { app } from 'electron';
import { createWindow } from './utils/create-window';
import { minutes } from './utils/time';

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

const initializeFilePicker = () => {
  filePicker.create();
  app.on('activate', () => filePicker.show());

  let timeoutId = null;
  filePicker.on('show', () => clearTimeout(timeoutId));
  filePicker.on('hide', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(filePicker.close, minutes(15).toMilliseconds());
  });
};

export { filePicker, initializeFilePicker };
