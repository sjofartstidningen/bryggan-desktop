import { BrowserWindow } from 'electron';
import { is } from 'electron-util';
import { windows } from './utils/window-cache';
import * as routes from './utils/routes';
import { waitForRenderer } from './utils/ipc';

const name = 'main-window';

const initialize = async ({ page, query } = {}) => {
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
  win.on('close', () => windows.delete(name));

  if (page) {
    routes.loadRoute({
      win,
      page,
      query,
      devtools: is.development,
    });
    await waitForRenderer(`${name}-ready`);
  }

  return win;
};

const loadRoute = async ({ page, query } = {}) => {
  if (windows.has(name)) {
    const win = windows.get(name);
    routes.loadRoute({
      win,
      page,
      query,
      devtools: is.development,
    });
  }
};

const show = async ({ page } = {}) => {
  if (windows.has(name)) {
    const win = windows.get(name);
    win.show();
  } else {
    const win = await initialize({ page });
    win.show();
  }
};

const hide = () => {
  if (windows.has(name)) {
    const win = windows.get(name);
    win.hide();
  }
};

export { initialize, show, hide, loadRoute };
