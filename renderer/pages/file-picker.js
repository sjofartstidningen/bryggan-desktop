import React, { useState } from 'react';
import { useReady } from '../hooks';

function FilePicker() {
  const [count, setCount] = useState(0);
  useReady('file-picker');

  return (
    <div>
      <p>{count}</p>
      <div>
        <button onClick={() => setCount(count + 1)}>+</button>
        <button onClick={() => setCount(count - 1)}>-</button>
      </div>
    </div>
  );
}

export default FilePicker;
