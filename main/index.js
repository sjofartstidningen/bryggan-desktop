import path from 'path';
import { app } from 'electron';
import prepareNext from 'electron-next';
import log from 'electron-log';
import { is } from 'electron-util';
import ipc from 'electron-better-ipc';
import throttle from 'lodash.throttle';
import { installDevTools } from './utils/dev-tools';
import * as mainWindow from './main-window';
import { setupListeners } from './events';
import { parallell } from './utils/promise';
import { store } from './store';
import { fileQueue } from './utils/FileQueue';
import { setupExceptionHandler } from '../shared/exception-handler';
import { windows } from './utils/window-cache';

log.transports.file.level = is.development ? false : 'info';
log.transports.console.level = is.development ? 'verbose' : false;
log.info('---New execution---');

setupExceptionHandler(is.development);
setupListeners();

const getWindowConfig = () => ({
  page: fileQueue.size > 0 ? 'open-file' : 'file-picker',
});

const throttledOpenFileEmitter = throttle(
  () => ipc.callRenderer(windows.get('main-window'), 'open-file'),
  1000,
);

app.on('open-file', (event, path) => {
  event.preventDefault();
  log.info(`Wants to open file on path: ${path}`);
  fileQueue.push(path);

  if (windows.has('main-window')) throttledOpenFileEmitter();
});

(async () => {
  await app.whenReady();
  log.verbose('App ready starting execution');

  await parallell(
    () => prepareNext(path.join(app.getAppPath(), '/renderer')),
    () => installDevTools(),
  );

  log.verbose('Next and devtools prepared');

  await mainWindow.initialize(getWindowConfig());
  await mainWindow.show();

  const startupTime = Date.now() - global.init;
  log.info(`Startup time: ${startupTime}ms`);

  app.on('activate', () => {
    log.verbose('App reactivated');
    mainWindow.show(getWindowConfig());
  });
})();

app.on('window-all-closed', event => event.preventDefault());

app.on('quit', () => {
  if (is.development) store.clear();
});
