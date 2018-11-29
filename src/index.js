/* globals MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, MAIN_WINDOW_WEBPACK_ENTRY  */
import path from 'path';
import fs from 'fs';
import { app, nativeImage } from 'electron';
import debug from 'electron-debug';
import { is } from 'electron-util';
import { installDevTools } from './utils/install-dev-tools';
import { windowCache } from './utils/caches';
import { createWindow, createTray } from './utils/create';
import iconPath from './assets/tray-icon.png';

const createMainWindow = async () => {
  const win = await createWindow('main', {
    width: 300,
    height: 350,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (is.development) {
    // Install and open the DevTools.
    await installDevTools();
  }

  return win;
};

const createMainTray = async () => {
  const icon = nativeImage.createFromPath(path.join(__dirname, iconPath));
  const tray = createTray('main', icon);
  return tray;
};

const showWindow = (win, tray) => {
  const trayPos = tray.getBounds();
  const windowPos = win.getBounds();

  const x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
  const y = Math.round(trayPos.y + trayPos.height) + 10;

  win.setPosition(x, y, false);
  win.show();
  win.focus();
};

const toggleWindow = (win, tray) => {
  if (win.isVisible()) {
    win.hide();
  } else {
    showWindow(win, tray);
    if (is.development) {
      debug();
      win.webContents.openDevTools({ mode: 'detach' });
    }
  }
};

app.on('ready', async () => {
  const tray = await createMainTray();
  const win = await createMainWindow();

  app.dock.hide();

  tray.on('click', () => toggleWindow(win, tray));

  win.on('blur', () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide();
    }
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (!is.macos) app.quit();
});

app.on('activate', () => {
  if (!windowCache.has('main')) createMainWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
