import ipc from 'electron-better-ipc';

function setupListeners() {
  ipc.answerRenderer('open-file', () => {});
  ipc.answerRenderer('open-indd-file', () => {});
}

export { setupListeners };
