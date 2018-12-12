import ipc from 'electron-better-ipc';
import log from 'electron-log';
import { store } from './store';
import {
  openDropboxFile,
  openDropboxIndesignFile,
  openDropboxFolder,
} from './utils/open';

function setupListeners() {
  ipc.answerRenderer('open-folder', async ({ path }) => {
    try {
      await openDropboxFolder(path);
      log.verbose(`Successfully opened folder ${path}`);
      return true;
    } catch (err) {
      log.error(`Failed to open folder ${path}`);
      return false;
    }
  });

  ipc.answerRenderer('open-file', async ({ path }) => {
    try {
      await openDropboxFile(path);
      log.verbose(`Successfully opened file ${path}`);
      return true;
    } catch (err) {
      log.error(`Failed to open file ${path}`);
      return false;
    }
  });

  ipc.answerRenderer('open-indd-file', async ({ path }) => {
    try {
      await openDropboxIndesignFile(path);
      log.verbose(`Successfully opened InDesign file ${path}`);
      return true;
    } catch (err) {
      log.error(`Failed to open InDesign file ${path}`);
      return false;
    }
  });

  ipc.answerRenderer('dropbox-authorized', ({ accessToken }) => {
    log.verbose('New Dropbox access token recieved');
    store.set('dropboxAccessToken', accessToken);
  });

  ipc.answerRenderer('dropbox-unauthorize', () => {
    log.verbose('Dropbox access token revoked');
    store.delete('dropboxAccessToken');
  });

  ipc.answerRenderer('dropbox-path-updated', ({ path }) => {
    log.verbose(`Initial startup path updated to ${path}`);
    store.set('initialPath', path);
  });

  ipc.answerRenderer('show-all-files-updated', ({ showAllFiles }) => {
    log.verbose(`Initial show all files setting updated to: ${showAllFiles}`);
    store.set('showAllFiles', showAllFiles);
  });
}

export { setupListeners };
