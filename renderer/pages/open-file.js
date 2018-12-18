import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { Loading } from '../components/Loading';
import { useMainStore } from '../hooks';
import { callMain } from '../utils/ipc';
import { filesGet } from '../../shared/ipc-channels';
import { FileProcessor } from '../components/FileProcessor';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';
import { Button } from '../components/Button';

function OpenFile({ accessToken }) {
  const [files, setFiles] = useState(() => Router.query.files || []);
  const [error, setError] = useState(null);

  useEffect(() => {
    callMain(filesGet)
      .then(({ files }) => {
        setFiles(f => [...f, ...files]);
        setError(null);
      })
      .catch(setError);
  }, []);

  if (error) return <p>Error: ${error.message}</p>;
  if (files.length < 1) return <Loading message="Loading" threshold={500} />;
  return (
    <ul>
      {files.map(path => (
        <li key={path}>
          <FileProcessor path={path} />
        </li>
      ))}
    </ul>
  );
}

const OpenFileWrapper = () => {
  const { settled, response, error } = useMainStore(['accessToken']);

  if (settled && response && !response.accessToken) {
    Router.push({
      pathname: '/authorize',
      query: { from: '/open-file' },
    });
  }

  const goToFilePicker = () => Router.push('/file-picker');

  return (
    <div>
      <ContextMenu zIndex={4}>
        <ContextMenuItem>
          <Button type="button" onClick={goToFilePicker}>
            Go back
          </Button>
        </ContextMenuItem>
      </ContextMenu>
      <main style={{ zIndex: 1, padding: '1rem' }}>
        {!settled && <Loading message="Starting up" threshold={300} />}
        {settled && error && <p>{error.message}</p>}
        {settled && response && response.accessToken && (
          <OpenFile {...response} />
        )}
      </main>
    </div>
  );
};

export default OpenFileWrapper;
