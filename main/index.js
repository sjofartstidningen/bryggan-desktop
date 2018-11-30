import path from 'path';
import { app } from 'electron';
import prepareNext from 'electron-next';
import { installDevTools } from './utils/dev-tools';
import { initializeTray } from './tray';
import { initializeFilePicker } from './file-picker';

(async () => {
  await app.whenReady();

  await Promise.all([
    prepareNext(path.join(__dirname, '../renderer')),
    installDevTools(),
  ]);

  initializeTray();
  initializeFilePicker();
})();

app.on('window-all-closed', event => event.preventDefault());
