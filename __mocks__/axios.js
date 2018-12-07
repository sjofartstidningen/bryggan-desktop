const axios = jest.requireActual('axios');
const settle = require('axios/lib/core/settle');

let __responseData = {};
const __setResponseData = res => (__responseData = res);

const instance = axios.create({
  adapter(config) {
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
  },
});

instance.__setResponseData = __setResponseData;
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

module.exports = instance;
