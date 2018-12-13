import { CancelToken, isCancel } from 'axios';
import { useState, useEffect, useContext } from 'react';
import PQueue from 'p-queue';
import { DropboxContext } from '../context/DropboxContext';

/**
 * This queue is there to prevent fireing of simultaneous calls for the same
 * account id – instead this will queue all calls and run them one by one and
 * therefore the cached response will be available for subsequent calls.
 */
const queue = new PQueue({ concurrency: 1 });

function DisplayName({ accountId }) {
  const [displayName, setDisplayName] = useState('');
  const dropbox = useContext(DropboxContext);

  useEffect(
    () => {
      if (dropbox.stage === dropbox.Stage.authorized) {
        const controller = CancelToken.source();
        queue
          .add(() =>
            dropbox.getAccount(accountId, {
              cancelToken: controller.token,
              ignoreCache: false,
            }),
          )
          .then(({ account }) => setDisplayName(account.displayName))
          .catch(error => {
            console.error(error);
            if (isCancel(error)) return;
          });

        return () => controller.cancel();
      }
    },
    [accountId, dropbox.stage],
  );

  return displayName;
}

export { DisplayName };
