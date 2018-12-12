import ipc from 'electron-better-ipc';
import { store } from './store';
import {
  openDropboxFile,
  openDropboxIndesignFile,
  openDropboxFolder,
} from './utils/open';

const tryCatch = async fn => {
  try {
    await fn();
    return true;
  } catch (err) {
    return false;
  }
};

function setupListeners() {
  ipc.answerRenderer('open-folder', ({ path }) =>
    tryCatch(() => openDropboxFolder(path)),
  );

  ipc.answerRenderer('open-file', ({ path }) =>
    tryCatch(() => openDropboxFile(path)),
  );

  ipc.answerRenderer('open-indd-file', ({ path }) =>
    tryCatch(() => openDropboxIndesignFile(path)),
  );

  ipc.answerRenderer('dropbox-authorized', ({ accessToken }) => {
    store.set('dropboxAccessToken', accessToken);
  });

  ipc.answerRenderer('dropbox-unauthorize', () => {
    store.delete('dropboxAccessToken');
  });

  ipc.answerRenderer('dropbox-path-updated', ({ path }) => {
    store.set('initialPath', path);
  });

  ipc.answerRenderer('show-all-files-updated', ({ showAllFiles }) => {
    store.set('showAllFiles', showAllFiles);
  });
}

export { setupListeners };
