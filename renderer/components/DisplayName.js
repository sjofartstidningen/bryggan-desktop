import { CancelToken, isCancel } from 'axios';
import { useState, useEffect, useContext } from 'react';
import { DropboxContext } from '../context/Dropbox';

function DisplayName({ accountId }) {
  const [displayName, setDisplayName] = useState('');
  const dropbox = useContext(DropboxContext);

  useEffect(
    () => {
      const controller = CancelToken.source();
      dropbox
        .getAccount(accountId, {
          cancelToken: controller.token,
          ignoreCache: false,
        })
        .then(({ account }) => setDisplayName(account.displayName))
        .catch(error => {
          if (isCancel(error)) return;
          // TODO: Handle error
        });
    },
    [accountId],
  );

  return displayName;
}

export { DisplayName };
