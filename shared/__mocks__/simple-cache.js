const createSimpleCache = () => {
  const cache = new Map();

  return {
    set: jest.fn((key, value) => cache.set(key, value)),
    get: jest.fn(key => cache.get(key)),
    has: jest.fn(key => cache.has(key)),
    delete: jest.fn(key => cache.delete(key)),
    clear: jest.fn(() => cache.clear()),
  };
};

module.exports = { createSimpleCache };
