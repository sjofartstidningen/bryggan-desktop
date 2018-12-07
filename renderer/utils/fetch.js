const fetch = window && window.fetch ? window.fetch : require('node-fetch');

const AbortController =
  window && window.AbortController
    ? window.AbortController
    : require('abort-controller');

export { fetch, AbortController };
