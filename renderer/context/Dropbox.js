import React, { createContext, useMemo, useState, useEffect } from 'react';
import * as Dropbox from '../api/Dropbox';
import { callMain } from '../utils/ipc';

const DropboxContext = createContext();

function Provider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [currentAccount, setCurrentAccount] = useState({});

  useEffect(() => {
    callMain('get-state').then(({ dropboxAccessToken }) => {
      setAccessToken(dropboxAccessToken);
    });
  }, []);

  const listFolder = (path, { cancelToken, ignoreCache } = {}) => {
    return Dropbox.listFolder(path, { accessToken, cancelToken, ignoreCache });
  };

  const getAccount = (accountId, { cancelToken, ignoreCache } = {}) => {
    return Dropbox.getAccount(accountId, {
      accessToken,
      cancelToken,
      ignoreCache,
    });
  };

  const getCurrentAccount = ({ cancelToken } = {}) => {
    return Dropbox.getCurrentAccount({ accessToken, cancelToken });
  };

  const getToken = async ({ code, clientId, clientSecret }) => {
    const { accessToken } = await Dropbox.getToken({
      code,
      clientId,
      clientSecret,
    });
    setAccessToken(accessToken);
    return { accessToken };
  };

  const revokeToken = async () => {
    await Dropbox.revokeToken({ accessToken });
    setAccessToken(undefined);
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
    () => ({
      accessToken,
      setAccessToken,
      currentAccount,
      listFolder,
      getAccount,
      getCurrentAccount,
      getToken,
      revokeToken,
    }),
    [accessToken, currentAccount],
  );

  return (
    <DropboxContext.Provider value={contextValue}>
      {children}
    </DropboxContext.Provider>
  );
}

export { DropboxContext, Provider };
