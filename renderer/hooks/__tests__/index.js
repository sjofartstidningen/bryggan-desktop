import React, { useState, useEffect } from 'react';
import { render, flushEffects, waitForElement } from 'react-testing-library';
import log from 'electron-log';
import { callMain } from '../../utils/ipc';
import * as channel from '../../../shared/ipc-channels';
import * as hooks from '../';

jest.mock('electron-log');
jest.mock('../../utils/ipc.js');

afterEach(() => {
  jest.useRealTimers();
});

describe('Hook: useInterval', () => {
  it('should trigger an interval', async () => {
    jest.useFakeTimers();
    const intervalHandler = jest.fn();
    const Component = () => {
      hooks.useInterval(intervalHandler, 1000, []);
      return null;
    };

    render(<Component />);
    flushEffects();

    jest.advanceTimersByTime(1000);
    expect(intervalHandler).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(intervalHandler).toHaveBeenCalledTimes(2);
  });
});

describe('Hook: useWindowEvent', () => {
  it('should react to window events and fire a function', async () => {
    const Component = () => {
      const [inFocus, setInFocus] = useState(false);
      hooks.useWindowEvent('focus', () => setInFocus(true), []);
      return <p>{inFocus ? 'in focus' : 'no focus'}</p>;
    };

    const { getByText } = render(<Component />);
    flushEffects();

    expect(getByText(/no focus/)).toBeInTheDocument();

    window.dispatchEvent(new Event('focus'));
    expect(getByText(/in focus/)).toBeInTheDocument();
  });
});

describe('Hook: useWindowKeypress', () => {
  it('should react to window keypress event and compare keyCode', async () => {
    const Component = () => {
      const [pressed, setClicked] = useState(false);
      hooks.useWindowKeypress(114, () => setClicked(true), []);
      return <p>{pressed ? 'key pressed' : 'key not pressed'}</p>;
    };

    const { getByText } = render(<Component />);
    flushEffects();

    expect(getByText(/key not pressed/)).toBeInTheDocument();

    window.dispatchEvent(new KeyboardEvent('keypress', { keyCode: 114 }));
    expect(getByText(/key pressed/)).toBeInTheDocument();
  });
});

describe('Hook: useLog', () => {
  it('should call electron-log on useEffect', async () => {
    const Component = () => {
      hooks.useLog('info', 'mount message', 'unmount message', []);
      return null;
    };

    const { unmount } = render(<Component />);
    flushEffects();

    unmount();
    flushEffects();

    expect(log.info).toHaveBeenCalledTimes(2);
  });
});

describe('Hook: useIsMounted', () => {
  it('should return a function to determine if component is mounted', async () => {
    jest.useFakeTimers();
    const testFn = jest.fn();

    const Comp = () => {
      const isMounted = hooks.useIsMounted();
      useEffect(() => {
        setTimeout(() => {
          if (isMounted()) testFn();
        }, 10);
      });

      return <div />;
    };

    const { unmount } = render(<Comp />);
    flushEffects();
    unmount();
    jest.runOnlyPendingTimers();

    expect(testFn).not.toHaveBeenCalled();
  });
});

describe('Hook: usePromise', () => {
  const promiseFn = jest.fn().mockResolvedValue('foo');

  const Comp = () => {
    const [settled, resolved, rejected] = hooks.usePromise(promiseFn, []);

    if (!settled) return <p>Loading</p>;
    if (resolved) return <p>{resolved}</p>;
    if (rejected) return <p>{rejected.message}</p>;
  };

  it('should run a promise on emit the resolved value on settle', async () => {
    const { getByText } = render(<Comp />);
    flushEffects();
    await waitForElement(() => getByText(/foo/i));
    expect(getByText(/foo/i)).toBeInTheDocument();
  });

  it('should run a promise on emit the rejected value on settle', async () => {
    promiseFn.mockRejectedValueOnce(new Error('error message'));

    const { getByText } = render(<Comp />);
    flushEffects();
    await waitForElement(() => getByText(/error message/i));
    expect(getByText(/error message/i)).toBeInTheDocument();
  });

  it('should not emit values if component is unmounted', async () => {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    const spy = jest.spyOn(console, 'error');

    const { unmount } = render(<Comp />);
    flushEffects();
    unmount();

    await delay(0);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Hook: useMainStore', () => {
  it('should return values from the store on the main thread', async () => {
    callMain.mockImplementation((channel, { keys }) =>
      Promise.resolve(
        keys.reduce(
          (acc, key) => ({
            ...acc,
            [key]: key,
          }),
          {},
        ),
      ),
    );

    const Comp = () => {
      const { response, settled } = hooks.useMainStore(['foo']);
      return settled ? <p>{response.foo}</p> : <p>Loading</p>;
    };

    const { getByText } = render(<Comp />);
    flushEffects();

    await waitForElement(() => getByText(/foo/i));
    expect(getByText(/foo/i)).toBeInTheDocument();
    expect(callMain).toHaveBeenCalledWith(channel.storeGet, { keys: ['foo'] });
  });
});
