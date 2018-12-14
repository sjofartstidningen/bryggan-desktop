import ipc from 'electron-better-ipc';
import log from 'electron-log';
import { store } from './store';
import {
  openDropboxFile,
  openDropboxIndesignFile,
  openDropboxFolder,
} from './utils/open';
import * as channel from '../shared/ipc-channels';

function setupListeners() {
  ipc.answerRenderer(channel.getState, async () => store.store);

  ipc.answerRenderer(channel.storeGet, async ({ keys }) =>
    keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: store.get(key),
      }),
      {},
    ),
  );

  /**
   * Events to open files
   */
  ipc.answerRenderer(channel.openFolder, async ({ path }) => {
    try {
      await openDropboxFolder(path);
      log.verbose(`Successfully opened folder ${path}`);
      return true;
    } catch (err) {
      log.error(`Failed to open folder ${path}`);
      return false;
    }
  });

  ipc.answerRenderer(channel.openFile, async ({ path }) => {
    try {
      await openDropboxFile(path);
      log.verbose(`Successfully opened file ${path}`);
      return true;
    } catch (err) {
      log.error(`Failed to open file ${path}`);
      return false;
    }
  });

  ipc.answerRenderer(channel.openInddFile, async ({ path }) => {
    try {
      await openDropboxIndesignFile(path);
      log.verbose(`Successfully opened InDesign file ${path}`);
      return true;
    } catch (err) {
      log.error(`Failed to open InDesign file ${path}`);
      return false;
    }
  });

  /**
   * Dropbox related events
   */
  ipc.answerRenderer(channel.dropboxGetAccessToken, async () => {
    return {
      accessToken: store.get('accessToken'),
    };
  });

  ipc.answerRenderer(channel.dropboxAuthorized, ({ accessToken }) => {
    log.verbose('New Dropbox access token recieved');
    store.set('accessToken', accessToken);
  });

  ipc.answerRenderer(channel.dropboxUnauthorize, () => {
    try {
      log.verbose('Dropbox access token revoked');
      store.delete('accessToken');
    } catch (error) {
      log.error('Could not remove accessToken');
      log.error(error);
    }
  });

  /**
   * File Picker related events
   */
  ipc.answerRenderer(channel.filePickerGetShowAllFiles, () => ({
    showAllFiles: store.get('showAllFiles', false),
  }));

  ipc.answerRenderer(channel.filePickerGetInitialPath, () => ({
    initialPath: store.get('initialPath', '/'),
  }));

  ipc.answerRenderer(
    channel.filePickerInitialPathUpdated,
    ({ initialPath }) => {
      log.verbose(`Initial startup path updated to ${initialPath}`);
      store.set('initialPath', initialPath);
    },
  );

  ipc.answerRenderer(
    channel.filePickerShowAllFilesUpdated,
    ({ showAllFiles }) => {
      log.verbose(`Initial show all files setting updated to: ${showAllFiles}`);
      store.set('showAllFiles', showAllFiles);
    },
  );
}

export { setupListeners };
