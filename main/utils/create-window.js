'use strict';

const { BrowserWindow } = require('electron');
const ipc = require('electron-better-ipc');
const { windows } = require('./cache');
const { loadRoute } = require('./routes');

const defaultWindowOptions = {
  show: false,
};

function createWindow(name, windowOptions) {
  const isCreated = () => windows.has(name);
  const getWindow = () => windows.get(name);

  const create = () => {
    const win = new BrowserWindow(
      Object.assign({}, defaultWindowOptions, windowOptions),
    );

    windows.set(name, win);
    loadRoute(win, name);

    ipc.answerRenderer(`${name}-ready`, () => win.show());
  };

  const close = () => {
    if (isCreated()) {
      const win = getWindow();
      win.destroy();
      windows.delete(name);
    }
  };

  const hide = () => {
    if (isCreated()) {
      const win = getWindow();
      win.hide();
    }
  };

  const show = () => {
    if (isCreated()) {
      const win = getWindow();
      win.show();
    }
  };

  const toggle = () => {
    if (isCreated()) {
      close();
    } else {
      create();
    }
  };

  const toggleHidden = () => {
    if (!isCreated()) {
      create();
    } else {
      const win = getWindow();

      if (win.isVisible()) {
        hide();
      } else {
        show();
      }
    }
  };

  return {
    isCreated,
    getWindow,
    create,
    close,
    hide,
    show,
    toggle,
    toggleHidden,
  };
}

module.exports = { createWindow };
