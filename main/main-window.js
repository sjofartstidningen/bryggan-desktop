import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import windowStateKeeper from 'electron-window-state';
import { is } from 'electron-util';
import log from 'electron-log';
import { windows } from './utils/window-cache';
import * as routes from './utils/routes';
import { waitForRenderer } from './utils/ipc';

const name = 'main-window';

const initialize = async ({ page, query } = {}) => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 300,
    defaultHeight: 400,
  });

  const win = new BrowserWindow({
    show: false,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    title: 'Bryggan',
    titleBarStyle: 'hiddenInset',
    frame: false,
    resizable: false,
    movable: true,
    minimizable: true,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      webSecurity: false,
      preload: join(app.getAppPath(), 'main/preload.js'),
      devTools: is.development,
    },
  });

  mainWindowState.manage(win);
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

  log.info(`Main window initialized on page ${page}`);
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

const show = async config => {
  if (windows.has(name)) {
    const win = windows.get(name);
    win.show();
    log.verbose('Main window shown');
  } else {
    const win = await initialize(config);
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
