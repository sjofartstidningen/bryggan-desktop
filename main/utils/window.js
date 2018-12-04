import { windows } from './cache';

function ifWindow(windowName, cb) {
  return (...args) => {
    if (!windows.has(windowName)) return;
    cb(...args);
  };
}

export { ifWindow };
