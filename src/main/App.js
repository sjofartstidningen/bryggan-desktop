import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const onCount = (_, newCount) => setCount(newCount);
    ipcRenderer.on('count-updated', onCount);
    return () => ipcRenderer.removeListener('count-updated', onCount);
  }, []);

  const inc = () => ipcRenderer.send('count-inc');
  const dec = () => ipcRenderer.send('count-dec');

  return (
    <div>
      <p>Count: {count}</p>
      <div>
        <button onClick={inc}>+</button>
        <button onClick={dec}>-</button>
      </div>
    </div>
  );
}

export { App as default };
