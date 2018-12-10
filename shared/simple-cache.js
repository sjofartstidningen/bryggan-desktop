const createSimpleCache = (defaultTtl = 0) => {
  const cache = new Map();

  const del = key => cache.delete(key);

  const set = (key, value, ttl = defaultTtl) => {
    cache.set(key, value);
    if (ttl > 0) setTimeout(() => del(key), ttl);
  };

  const get = key => cache.get(key);
  const has = key => cache.has(key);
  const clear = () => cache.clear();

  return {
    set,
    get,
    has,
    delete: del,
    clear,
  };
};

export { createSimpleCache };
