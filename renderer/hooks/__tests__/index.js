import React, { useState, useEffect } from 'react';
import { render, flushEffects } from 'react-testing-library';
import log from 'electron-log';
import * as hooks from '../';

jest.mock('electron-log');

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
