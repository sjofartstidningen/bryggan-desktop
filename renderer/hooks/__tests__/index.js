import React, { useState } from 'react';
import { render, flushEffects } from 'react-testing-library';
import * as hooks from '../';

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
