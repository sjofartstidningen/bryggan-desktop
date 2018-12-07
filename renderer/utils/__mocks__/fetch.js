import { AbortController } from 'abort-controller';

let __response = {};
const __setResponse = res => (__response = res);

const fetch = (url, { signal }) =>
  new Promise((resolve, reject) => {
    if (signal) {
      signal.addEventListener('abort', () => {
        reject(new Error('Request aborted'));
      });
    }

    setTimeout(() => {
      const response = {
        ok: true,
        status: 200,
        url,
        json: () => Promise.resolve(__response),
      };

      resolve(response);
    });
  });

export { fetch, AbortController, __setResponse };
