import path from 'path';
import { app } from 'electron';
import prepareNext from 'electron-next';
import { installDevTools } from './utils/dev-tools';
import * as mainWindow from './main-window';
import { setupListeners } from './events';
import { parallell } from './utils/promise';
import { store } from './store';

const getWindowConfig = () => ({
  page: store.has('dropboxAccessToken') ? 'file-picker' : 'authorize',
  query: {
    accessToken: store.get('dropboxAccessToken'),
    initialPath: store.get('initialPath', '/'),
    showAllFiles: store.get('showAllFiles', false),
  },
});

(async () => {
  await app.whenReady();

  await parallell(
    () => prepareNext(path.join(app.getAppPath(), '/renderer')),
    () => installDevTools(),
  );

  setupListeners();

  await mainWindow.initialize(getWindowConfig());
  await mainWindow.show();

  app.on('activate', () => mainWindow.show(getWindowConfig()));
})();

app.on('window-all-closed', event => event.preventDefault());
