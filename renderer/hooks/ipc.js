import { useEffect } from 'react';
import { callMain } from '../utils/ipc';

function useCallMain(thread, payload, when) {
  useEffect(() => {
    callMain(thread, payload);
  }, when);
}

export { useCallMain };
