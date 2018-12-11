import path from 'path';
import { app } from 'electron';
import prepareNext from 'electron-next';
import { installDevTools } from './utils/dev-tools';
import * as mainWindow from './main-window';
import { setupListeners } from './open-file';
import { parallell } from './utils/promise';

(async () => {
  await app.whenReady();

  await parallell(
    () => prepareNext(path.join(app.getAppPath(), '/renderer')),
    () => installDevTools(),
  );

  setupListeners();

  await mainWindow.initialize({
    page: 'file-picker',
    query: {
      dropboxApiKey: process.env.DROPBOX_API_KEY,
      initialPath: '/',
    },
  });
  await mainWindow.show();

  app.on('activate', () => mainWindow.show());
})();

app.on('window-all-closed', event => event.preventDefault());
