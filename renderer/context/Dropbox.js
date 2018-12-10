import React, { createContext, useMemo } from 'react';
import * as Dropbox from '../api/Dropbox';

const DropboxContext = createContext();

function Provider({ apiKey, children }) {
  const listFolder = (path, { cancelToken, ignoreCache }) => {
    if (!apiKey) throw new Error('Api key is required before using the api');
    return Dropbox.listFolder(path, { apiKey, cancelToken, ignoreCache });
  };

  const getAccount = (accountId, { cancelToken, ignoreCache }) => {
    if (!apiKey) throw new Error('Api key is required before using the api');
    return Dropbox.getAccount(accountId, { apiKey, cancelToken, ignoreCache });
  };

  const contextValue = useMemo(() => ({ listFolder, getAccount }), [apiKey]);

  return (
    <DropboxContext.Provider value={contextValue}>
      {children}
    </DropboxContext.Provider>
  );
}

export { DropboxContext, Provider };
