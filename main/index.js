import path from 'path';
import { app } from 'electron';
import prepareNext from 'electron-next';
import log from 'electron-log';
import { is } from 'electron-util';
import debounce from 'lodash.debounce';
import ipc from 'electron-better-ipc';
import { installDevTools } from './utils/dev-tools';
import * as mainWindow from './main-window';
import { setupListeners } from './events';
import { setupMenus } from './menus';
import { parallell } from './utils/promise';
import { store } from './store';
import { fileQueue } from './utils/FileQueue';
import { setupExceptionHandler } from '../shared/exception-handler';
import { windows } from './utils/window-cache';

log.transports.file.level = is.development ? false : 'info';
log.transports.console.level = is.development ? 'verbose' : false;
log.info('---New execution---');
log.info(`Process args: ${process.argv.join(', ')}`);

let isReady = false;

setupExceptionHandler(is.development);
setupListeners();

const getWindowConfig = () => ({
  page: fileQueue.size > 0 ? 'open-file' : 'file-picker',
});

app.on('will-finish-launching', () => {
  log.verbose('App will finish launching, setting up open-file listener');

  const emitOpenFile = debounce(() => {
    if (windows.has('main-window')) {
      log.verbose('Emitting open-file to main-window');
      ipc.callRenderer(windows.get('main-window'), 'open-file');
    }

    if (isReady) mainWindow.show();
  }, 300);

  app.on('open-file', (event, path) => {
    event.preventDefault();
    log.info(`Wants to open file on path: ${path}`);
    fileQueue.push(path);

    emitOpenFile();
  });
});

app.on('ready', async () => {
  log.verbose('App ready starting execution');

  await parallell(
    () => prepareNext(path.join(app.getAppPath(), '/renderer')),
    () => installDevTools(),
    () => setupMenus(),
  );

  log.verbose('Next and devtools prepared');

  await mainWindow.initialize(getWindowConfig());
  await mainWindow.show();

  const startupTime = Date.now() - global.init;
  log.info(`Startup time: ${startupTime}ms`);
  isReady = true;

  app.on('activate', () => {
    log.verbose('App reactivated');
    mainWindow.show(getWindowConfig());
  });
});

app.on('window-all-closed', event => event.preventDefault());

app.on('quit', () => {
  if (is.development) store.clear();
});
