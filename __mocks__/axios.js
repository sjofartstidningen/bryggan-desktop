const axios = jest.requireActual('axios');
const settle = require('axios/lib/core/settle');

let __responseData = {};
const __setResponseData = res => (__responseData = res);

axios.defaults.adapter = function adapter(config) {
  return new Promise((resolve, reject) => {
    const response = {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      request: null,
      ...__responseData,
    };

    setTimeout(() => settle(resolve, reject, response));
  });
};

axios.__setResponseData = __setResponseData;

module.exports = axios;
