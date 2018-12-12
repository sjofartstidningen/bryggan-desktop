import React, { createContext, useMemo, useState, useEffect } from 'react';
import * as Dropbox from '../api/Dropbox';

const DropboxContext = createContext();

function Provider({ accessToken: initialAccessToken, children }) {
  const [accessToken, setAccessToken] = useState(() => initialAccessToken);
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
    if (!accessToken)
      throw new Error('App is not authorized, so no token to revoke');
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
