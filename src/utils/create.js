import { BrowserWindow, Tray } from 'electron';
import { windowCache, trayCache } from './caches';

async function createWindow(name, options) {
  const win = new BrowserWindow(options);
  windowCache.set(name, win);

  win.on('closed', () => windowCache.delete(name));

  return win;
}

async function createTray(name, icon) {
  const tray = new Tray(icon);
  trayCache.set(name, tray);

  return tray;
}

export { createWindow, createTray };
