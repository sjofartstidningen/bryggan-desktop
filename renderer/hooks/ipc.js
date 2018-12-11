import { useEffect } from 'react';
import { callMain } from '../utils/ipc';

function useCallMain(channel, payload, when) {
  useEffect(() => {
    callMain(channel, payload);
  }, when);
}

export { useCallMain };
