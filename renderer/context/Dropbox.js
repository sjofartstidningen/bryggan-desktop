import React, { createContext, useMemo, useState, useEffect } from 'react';
import * as Dropbox from '../api/Dropbox';

const DropboxContext = createContext();

function Provider({ apiKey, children }) {
  const [currentAccount, setCurrentAccount] = useState({});

  const listFolder = (path, { cancelToken, ignoreCache } = {}) => {
    if (!apiKey) throw new Error('Api key is required before using the api');
    return Dropbox.listFolder(path, { apiKey, cancelToken, ignoreCache });
  };

  const getAccount = (accountId, { cancelToken, ignoreCache } = {}) => {
    if (!apiKey) throw new Error('Api key is required before using the api');
    return Dropbox.getAccount(accountId, { apiKey, cancelToken, ignoreCache });
  };

  const getCurrentAccount = ({ cancelToken } = {}) => {
    if (!apiKey) throw new Error('Api key is required before using the api');
    return Dropbox.getCurrentAccount({ apiKey, cancelToken });
  };

  useEffect(
    () => {
      if (apiKey) {
        getCurrentAccount()
          .then(({ account }) => setCurrentAccount(account))
          .catch(() => {});
      }
    },
    [apiKey],
  );

  const contextValue = useMemo(
    () => ({ currentAccount, listFolder, getAccount, getCurrentAccount }),
    [apiKey, currentAccount],
  );

  return (
    <DropboxContext.Provider value={contextValue}>
      {children}
    </DropboxContext.Provider>
  );
}

export { DropboxContext, Provider };
