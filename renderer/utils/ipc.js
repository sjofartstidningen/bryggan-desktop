import log from 'electron-log';

const callMain = async (...args) => {
  const ipc = require('electron-better-ipc');
  log.verbose(`Call main on channel: ${args[0]}`);
  return ipc.callMain(...args);
};

const answerMain = (...args) => {
  const ipc = require('electron-better-ipc');
  log.verbose(`Setup answer to main on channel: ${args[0]}`);
  return ipc.answerMain(...args);
};

export { callMain, answerMain };
