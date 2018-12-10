import * as promise from '../promise';

describe('Module: promise.parallell', () => {
  it('should run promises in parallell', async () => {
    jest.useFakeTimers();

    const delay = (ms, onFulfill) =>
      new Promise(r => {
        setTimeout(() => {
          onFulfill();
          r();
        }, ms);
      });

    const onFulfill = jest.fn();
    const p = promise.parallell(
      () => delay(200, onFulfill),
      () => delay(200, onFulfill),
    );

    jest.advanceTimersByTime(200);
    await p;
    expect(onFulfill).toHaveBeenCalledTimes(2);
  });
});

describe('Module: promise.chain', () => {
  it('should run promises in chain', async () => {
    const addP = (a = 0) => (b = 0) => Promise.resolve(a + b);
    const res = await promise.chain(addP(10), addP(5));
    expect(res).toBe(15);
  });
});
