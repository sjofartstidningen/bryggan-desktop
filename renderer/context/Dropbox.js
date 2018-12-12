import React, { createContext, useMemo, useState, useEffect } from 'react';
import * as Dropbox from '../api/Dropbox';

const DropboxContext = createContext();

function Provider({ accessToken, children }) {
  const [currentAccount, setCurrentAccount] = useState({});

  const listFolder = (path, { cancelToken, ignoreCache } = {}) => {
    if (!accessToken)
      throw new Error('Api key is required before using the api');
    return Dropbox.listFolder(path, { accessToken, cancelToken, ignoreCache });
  };

  const getAccount = (accountId, { cancelToken, ignoreCache } = {}) => {
    if (!accessToken)
      throw new Error('Api key is required before using the api');
    return Dropbox.getAccount(accountId, {
      accessToken,
      cancelToken,
      ignoreCache,
    });
  };

  const getCurrentAccount = ({ cancelToken } = {}) => {
    if (!accessToken)
      throw new Error('Api key is required before using the api');
    return Dropbox.getCurrentAccount({ accessToken, cancelToken });
  };

  useEffect(
    () => {
      if (accessToken) {
        getCurrentAccount()
          .then(({ account }) => setCurrentAccount(account))
          .catch(() => {});
      }
    },
    [accessToken],
  );

  const contextValue = useMemo(
    () => ({ currentAccount, listFolder, getAccount, getCurrentAccount }),
    [accessToken, currentAccount],
  );

  return (
    <DropboxContext.Provider value={contextValue}>
      {children}
    </DropboxContext.Provider>
  );
}

export { DropboxContext, Provider };
