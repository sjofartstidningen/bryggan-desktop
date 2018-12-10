import { createSimpleCache } from '../simple-cache';

describe('Module: createSimpleCache', async () => {
  jest.useFakeTimers();
  it('should create a simple cache with ttl', () => {
    const cache = createSimpleCache(1000);
    cache.set('foo', 'bar');

    expect(cache.get('foo')).toBe('bar');

    jest.advanceTimersByTime(1000);
    expect(cache.has('foo')).toBeFalsy();

    cache.set('hello', 'world', 2000);
    expect(cache.get('hello')).toBe('world');

    jest.advanceTimersByTime(1000);
    expect(cache.has('hello')).toBeTruthy();

    jest.advanceTimersByTime(1000);
    expect(cache.has('hello')).toBeFalsy();
  });
});
