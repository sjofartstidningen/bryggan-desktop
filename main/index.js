import path from 'path';
import { app } from 'electron';
import prepareNext from 'electron-next';
import { installDevTools } from './utils/dev-tools';
import * as filePicker from './file-picker';
import { parallell } from './utils/promise';

(async () => {
  await app.whenReady();

  await parallell(
    () => prepareNext(path.join(app.getAppPath(), '/renderer')),
    () => installDevTools(),
  );

  await filePicker.initialize();
  await filePicker.show();

  app.on('activate', () => filePicker.show());
})();

app.on('window-all-closed', event => event.preventDefault());
