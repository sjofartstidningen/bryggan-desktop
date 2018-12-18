import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { Loading } from '../components/Loading';
import { useMainStore } from '../hooks';
import { callMain, answerMain } from '../utils/ipc';
import { filesGet } from '../../shared/ipc-channels';
import { FileProcessor } from '../components/FileProcessor';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';
import { Button } from '../components/Button';
import PQueue from 'p-queue';

const fileProcessQueue = new PQueue({ concurrency: 1 });

function OpenFile({ accessToken }) {
  const [files, setFiles] = useState(() => Router.query.files || []);
  const [error, setError] = useState(null);

  const getFiles = () =>
    callMain(filesGet)
      .then(({ files }) => {
        setFiles(f => [
          ...f,
          ...files.map(path => ({ path, stamp: Date.now() })),
        ]);
        setError(null);
      })
      .catch(setError);

  useEffect(() => {
    getFiles();
  }, []);

  useEffect(() => answerMain('open-file', () => getFiles()), []);

  if (error) return <p>Error: ${error.message}</p>;
  if (files.length < 1) return <Loading message="Loading" threshold={500} />;
  return (
    <ul>
      {files.map(({ path, stamp }) => (
        <li key={`${path}-${stamp}`}>
          <FileProcessor path={path} queue={fileProcessQueue} />
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
