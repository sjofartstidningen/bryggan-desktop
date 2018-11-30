import { BrowserWindow } from 'electron';
import ipc from 'electron-better-ipc';
import { windows } from './cache';
import { loadRoute } from './routes';

const defaultWindowOptions = {
  show: false,
};

function createWindow(name, windowOptions) {
  const onEvents = [];
  const onceEvents = [];

  const getWindow = () => windows.get(name);
  const isCreated = () => windows.has(name);
  const isVisible = () => isCreated() && getWindow().isVisible();

  const create = () => {
    const win = new BrowserWindow(
      Object.assign({}, defaultWindowOptions, windowOptions),
    );

    windows.set(name, win);
    loadRoute(win, name);

    ipc.answerRenderer(`${name}-ready`, () => win.show());

    onEvents.forEach(([event, handler]) => win.on(event, handler));
    onceEvents.forEach(([event, handler]) => win.once(event, handler));

    win.on('closed', () => windows.delete(name));

    return win;
  };

  const close = () => {
    if (isCreated()) getWindow().destroy();
  };

  const hide = () => {
    if (isCreated()) getWindow().hide();
  };

  const show = () => {
    return new Promise(resolve => {
      if (isCreated()) getWindow().show();
      else create();
      once('show', resolve);
    });
  };

  const toggleClosed = () => {
    if (isCreated()) close();
    else create();
  };

  const toggle = () => {
    if (isCreated() && isVisible()) hide();
    else if (isCreated()) show();
    else create();
  };

  const off = (event, handler) => {
    onEvents.filter(evt => evt[0] !== event && evt[1] !== handler);
    if (isCreated()) getWindow().off(event, handler);
  };

  const on = (event, handler) => {
    onEvents.push([event, handler]);
    if (isCreated()) getWindow().on(event, handler);
    return () => off(event, handler);
  };

  const once = (event, handler) => {
    if (isCreated()) {
      getWindow().once(event, handler);
    } else {
      onceEvents.push([event, handler]);
    }
  };

  return {
    getWindow,
    isCreated,
    isVisible,
    create,
    close,
    hide,
    show,
    toggleClosed,
    toggle,
    off,
    on,
    once,
  };
}

export { createWindow };
