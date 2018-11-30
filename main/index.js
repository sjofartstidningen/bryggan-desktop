import path from 'path';
import { app } from 'electron';
import prepareNext from 'electron-next';
import { initializeTray } from './tray';
import { installDevTools } from './utils/dev-tools';

(async () => {
  await app.whenReady();
  app.dock.hide();

  await Promise.all([
    prepareNext(path.join(__dirname, '../renderer')),
    installDevTools(),
  ]);

  initializeTray();
})();

app.on('window-all-closed', event => event.preventDefault());
