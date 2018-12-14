import { basename } from 'path';
import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import log from 'electron-log';
import PQueue from 'p-queue';
import { Loading } from '../components/Loading';
import { useMainStore } from '../hooks';
import { callMain } from '../utils/ipc';
import { filesGet, fileOpen } from '../../shared/ipc-channels';

const fileProcessQueue = new PQueue({ concurrency: 1 });

function OpenFile({ accessToken }) {
  const [files, setFiles] = useState(() => Router.query.files || []);
  const [fileInProcess, setFileInProcess] = useState(null);

  useEffect(() => {
    callMain(filesGet)
      .then(({ files }) => setFiles(files))
      .catch(error => log.error(error));
  }, []);

  const processFile = async file => {
    setFileInProcess(basename(file));
    try {
      await callMain(fileOpen, { path: file });
    } catch (err) {
      console.error(err);
      // void
    }
  };
  // new Promise(resolve => {
  //   setFileInProcess(basename(file));
  //   setTimeout(resolve, 1000);
  // });

  useEffect(
    () => {
      if (files.length > 0) {
        Promise.all(
          files.map(file => fileProcessQueue.add(() => processFile(file))),
        ).then(() => {
          setFileInProcess(null);
        });
      }
    },
    [files],
  );

  const loadingMessage = fileInProcess ? `Opening ${fileInProcess}` : 'Loading';

  return <Loading message={loadingMessage} threshold={500} />;
}

const OpenFileWrapper = () => {
  const { settled, response, error } = useMainStore(['accessToken']);

  if (settled && response && !response.accessToken) {
    Router.push({
      pathname: '/authorize',
      query: { from: '/open-file' },
    });
  }

  return (
    <div>
      <main style={{ zIndex: 1 }}>
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
