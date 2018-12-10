class CancelToken {
  constructor() {
    this.cancel = jest.fn();
    this.token = 'token';
  }
}

CancelToken.source = jest.fn(() => new CancelToken());

module.exports = {
  get: jest.fn(() => Promise.resolve({ data: null })),
  post: jest.fn(() => Promise.resolve({ data: null })),
  CancelToken: CancelToken,
  isCancel: jest.fn(err => err instanceof CancelToken),
};
