import { BrowserWindow } from 'electron';
import { is } from 'electron-util';
import { windows } from './utils/window-cache';
import { loadRoute } from './utils/routes';
import { waitForRenderer } from './utils/ipc';

const name = 'file-picker';

const initialize = async () => {
  const win = new BrowserWindow({
    show: false,
    width: 300,
    height: 350,
    center: true,
    title: 'Bryggan',
    titleBarStyle: 'hiddenInset',
    frame: false,
    resizable: false,
    movable: true,
    minimizable: true,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      webSecurity: true,
      devTools: is.development,
    },
  });

  windows.set(name, win);
  loadRoute(win, name, is.development);

  win.on('close', () => windows.delete(name));

  await waitForRenderer(`${name}-ready`);
  return win;
};

const show = async () => {
  if (windows.has(name)) {
    const win = windows.get(name);
    win.show();
  } else {
    const win = await initialize();
    win.show();
  }
};

const hide = () => {
  if (windows.has(name)) {
    const win = windows.get(name);
    win.hide();
  }
};

export { initialize, show, hide };
