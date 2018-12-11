import ipc from 'electron-better-ipc';
import { store } from './store';

function setupListeners() {
  ipc.answerRenderer('open-file', () => {});
  ipc.answerRenderer('open-indd-file', () => {});

  ipc.answerRenderer('dropbox-signed-in', ({ apiKey }) =>
    store.set('dropboxApiKey', apiKey),
  );

  ipc.answerRenderer('dropbox-path-updated', ({ path }) =>
    store.set('initialPath', path),
  );

  ipc.answerRenderer('show-all-files-updated', ({ showAllFiles }) =>
    store.set('showAllFiles', showAllFiles),
  );
}

export { setupListeners };
