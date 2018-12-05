import mitt from 'mitt';
import ipc from 'electron-better-ipc';
import { is } from 'electron-util';

const events = mitt();
const eventName = 'SECRET_INTERNALS_EVENT_DO_NOT_USE';

events.once = function once(type, handler) {
  const onEvent = (...args) => {
    events.off(type, onEvent);
    handler(...args);
  };

  events.on(type, onEvent);
};

events.waitFor = function waitFor(type, maxWait = 0) {
  if (type === '*') throw new Error('Can not await the "*"-event');

  return new Promise((resolve, reject) => {
    let timeoutId;
    if (maxWait) {
      timeoutId = setTimeout(() => {
        reject(
          new Error(
            `The event ${type} did not occur during the max waiting time`,
          ),
        );
      }, maxWait);
    }

    events.once(type, payload => {
      clearTimeout(timeoutId);
      resolve(payload);
    });
  });
};

if (is.main) {
  const handleAll = (type, payload) => {
    const { windows } = require('../main/utils/cache');
    windows.forEach(w => ipc.callRenderer(w, eventName, { type, payload }));
  };

  events.on('*', handleAll);

  ipc.answerRenderer(eventName, ({ type, payload }) => {
    events.off('*', handleAll);
    events.emit(type, payload);
    events.on('*', handleAll);
  });
}

if (is.renderer) {
  const handleAll = (type, payload) => {
    ipc.callMain(eventName, { type, payload });
  };

  events.on('*', handleAll);

  ipc.answerMain(eventName, ({ type, payload }) => {
    events.off('*', handleAll);
    events.emit(type, payload);
    events.on('*', handleAll);
  });
}

export { events };
