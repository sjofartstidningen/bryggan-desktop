import React from 'react';
import { render, flushEffects } from 'react-testing-library';
import { useReady } from '../';
import ipc from 'electron-better-ipc';

jest.mock('electron-better-ipc');

const Wrapper = () => {
  useReady('comp');
  return <p>Hello world!</p>;
};

it('hooks.useReady', async () => {
  render(<Wrapper />);
  await flushEffects();
  expect(ipc.callMain).toHaveBeenCalled();
  expect(ipc.callMain).toHaveBeenCalledWith('comp-ready');
});
