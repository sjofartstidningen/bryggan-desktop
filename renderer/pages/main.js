import React, { useState } from 'react';

function Index() {
  const [count, setCount] = useState(0);

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

export default Index;
