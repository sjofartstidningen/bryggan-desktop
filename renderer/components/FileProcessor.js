import { basename } from 'path';
import React, { useState, useEffect } from 'react';
import PQueue from 'p-queue';
import { callMain } from '../utils/ipc';
import { fileOpen } from '../../shared/ipc-channels';
import { InDesignStatusFile } from './FolderItem';

const fileProcessQueue = new PQueue({ concurrency: 1 });

function FileProcessor({ path }) {
  const [state, setState] = useState('waiting');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fileProcessQueue.add(async () => {
      setState('processing');

      try {
        await callMain(fileOpen, { path });
        setState('success');
      } catch (error) {
        setState('fail');
        setMessage(error.message || 'Could not open file');
      }
    });
  }, []);

  const statusColor =
    state === 'processing'
      ? 'yellow'
      : state === 'success'
      ? 'green'
      : state === 'fail'
      ? 'red'
      : 'lightGrey';

  return (
    <InDesignStatusFile
      file={basename(path)}
      statusColor={statusColor}
      message={message}
    />
  );
}

export { FileProcessor };
