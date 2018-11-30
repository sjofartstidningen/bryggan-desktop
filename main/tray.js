import { Tray } from 'electron';
import { filePicker } from './file-picker';
import { trayMenu } from './menus';
import { getIcon } from './utils/icons.js';
import { minutes } from './utils/time';
import { productName, version } from '../package.json';

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

export { initializeTray };
