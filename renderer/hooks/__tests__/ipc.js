import React from 'react';
import { render, flushEffects } from 'react-testing-library';
import ipc from 'electron-better-ipc';
import { useCallMain } from '../ipc';

jest.mock('electron-better-ipc');

describe('Hook: ipc.useCallMain', () => {
  afterEach(() => {
    ipc.callMain.mockReset();
  });

  it('should call main thread with provided args', () => {
    const Component = () => {
      useCallMain('foo', { foo: 'bar' }, []);
      return null;
    };
    render(<Component />);
    flushEffects();

    expect(ipc.callMain).toHaveBeenCalled();
  });

  it('should accept a last argument to pass as last arg to useEffect', () => {
    const Component = () => {
      useCallMain('foo', { foo: 'bar' });
      return null;
    };

    const { container } = render(<Component />);
    flushEffects();

    render(<Component />, { container });
    flushEffects();

    expect(ipc.callMain).toHaveBeenCalledTimes(2);
  });
});
