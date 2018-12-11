import path from 'path';
import { app } from 'electron';
import prepareNext from 'electron-next';
import { installDevTools } from './utils/dev-tools';
import * as mainWindow from './main-window';
import { setupListeners } from './events';
import { parallell } from './utils/promise';
import { store } from './store';

/**
 * REMOVE THIS LATER WHEN
 * SIGN IN PROESS IS SETUP...
 */
store.set('dropboxApiKey', process.env.DROPBOX_API_KEY);

const getWindowConfig = () => ({
  page: store.has('dropboxApiKey') ? 'file-picker' : 'sign-in',
  query: {
    dropboxApiKey: store.get('dropboxApiKey'),
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
