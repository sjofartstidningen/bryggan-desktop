import { Tray } from 'electron';
import { trayMenu } from './menus';
import { filePicker } from './file-picker';
import { getIcon } from './utils/icons.js';
import { productName, version } from '../package.json';

let tray = null;
const useTray = false;

function initializeTray() {
  // This variable will later on come from a config
  if (useTray) {
    tray = new Tray(getIcon('trayIconTemplate.png'));

    tray.setToolTip(`${productName} v${version}`);

    tray.on('click', () => filePicker.toggle());
    tray.on('right-click', () => tray.popUpContextMenu(trayMenu));

    filePicker.on('show', () => tray.setHighlightMode('always'));
    filePicker.on('hide', () => tray.setHighlightMode('never'));
  }
}

export { initializeTray };
