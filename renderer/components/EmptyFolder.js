import React from 'react';
import { XCircle } from './Icon';

function EmptyFolder() {
  return (
    <div>
      <p>
        <XCircle />
      </p>
      <p>No relevant items in this folder</p>
    </div>
  );
}

export { EmptyFolder };
