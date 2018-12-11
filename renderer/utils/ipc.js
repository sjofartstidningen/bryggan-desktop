const callMain = (...args) => {
  const ipc = require('electron-better-ipc');
  return ipc.callMain(...args);
};

const answerMain = (...args) => {
  const ipc = require('electron-better-ipc');
  return ipc.answerMain(...args);
};

export { callMain, answerMain };
