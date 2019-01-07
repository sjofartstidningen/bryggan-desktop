import ipc from 'electron-better-ipc';

function waitForRenderer(event, maxDuration = 0) {
  return new Promise((resolve, reject) => {
    let timeoutId;
    if (maxDuration) {
      timeoutId = setTimeout(reject, maxDuration);
    }

    ipc.answerRenderer(event, response => {
      clearTimeout(timeoutId);
      resolve(response);
    });
  });
}

export { waitForRenderer };
