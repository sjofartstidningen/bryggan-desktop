import React from 'react';
import { render, flushEffects } from 'react-testing-library';
import { useReady } from '../';
import { events } from '../../../shared/events';

jest.mock('electron-better-ipc', () => ({}));

jest.mock('electron-util', () => ({ is: { main: false, renderer: false } }));

const Wrapper = () => {
  useReady('comp');
  return <p>Hello world!</p>;
};

it('hooks.useReady', async () => {
  const onReady = jest.fn();
  events.on('comp-ready', onReady);
  render(<Wrapper />);

  await flushEffects();

  expect(onReady).toHaveBeenCalled();
});
