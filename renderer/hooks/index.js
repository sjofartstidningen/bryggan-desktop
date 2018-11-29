import { useEffect } from 'react';

const useReady = pageName => {
  useEffect(() => {
    const ipc = require('electron-better-ipc');
    ipc.callMain(`${pageName}-ready`);
  }, []);
};

export { useReady };
