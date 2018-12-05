import { BrowserWindow } from 'electron';
import { is } from 'electron-util';
import { windows } from './utils/cache';
import { loadRoute } from './utils/routes';
import { ifWindow } from './utils/window';
import { events } from '../shared/events';

const name = 'file-picker';

const initialize = async () => {
  const win = new BrowserWindow({
    width: 300,
    height: 350,
    title: 'File Picker',
    frame: false,
    titleBarStyle: 'hiddenInset',
    moveable: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    center: true,
    show: false,
    webPreferences: { webSecurity: true },
  });

  windows.set(name, win);
  loadRoute(win, name, is.development);

  win.on('close', () => windows.delete(name));
  await events.waitFor(`${name}-ready`);
};

const show = ifWindow(name, () => {
  const win = windows.get(name);
  win.show();
});

const hide = ifWindow(name, () => {
  const win = windows.get(name);
  win.hide();
});

export { initialize, show, hide };
