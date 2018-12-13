import React, { createContext, useState, useEffect, useMemo } from 'react';
import log from 'electron-log';
import qs from 'qs';
import * as Dropbox from '../api/Dropbox';
import { callMain } from '../utils/ipc';
import env from '../../shared/env-config';
import {
  dropboxGetAccessToken,
  dropboxAuthorized,
  dropboxUnauthorize,
} from '../../shared/ipc-channels';

const DropboxContext = createContext();

const Stage = {
  initial: 'INITIAL',
  authorized: 'AUTHORIZED',
  unauthorized: 'UNAUTHORIZED',
};

function DropboxProvider({ children }) {
  const [stage, setStage] = useState(Stage.initial);
  const [accessToken, setAccessToken] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    log.verbose('Will fetch access token');

    callMain(dropboxGetAccessToken)
      .then(({ dropboxAccessToken }) => {
        if (
          typeof dropboxAccessToken === 'string' &&
          dropboxAccessToken !== 'null'
        ) {
          log.info(`Access token retrieved`);
          setAccessToken(dropboxAccessToken);
          setStage(Stage.authorized);
        } else {
          log.info('Access token not retrieved');
          setStage(Stage.unauthorized);
        }
      })
      .catch(error => {
        log.info('Access token not retrieved, with error');
        log.error(error);
        setStage(Stage.unauthorized);
      });
  }, []);

  useEffect(
    () => {
      if (stage === Stage.authorized && !currentAccount) {
        console.log('Fetching current account');
        Dropbox.getCurrentAccount({ accessToken })
          .then(({ account }) => setCurrentAccount(account))
          .catch(error => log.error(error));
      }
    },
    [stage],
  );

  const listFolder = (path, { ignoreCache, cancelToken }) =>
    Dropbox.listFolder(path, { accessToken, ignoreCache, cancelToken });

  const getAccount = (accountId, { ignoreCache, cancelToken }) =>
    Dropbox.getAccount(accountId, { accessToken, cancelToken, ignoreCache });

  const getAuthorizeEndpoint = () => {
    const query = qs.stringify({
      response_type: 'code',
      client_id: env.DROPBOX_APP_KEY,
      require_role: 'work',
      disable_signup: true,
    });

    return `https://www.dropbox.com/oauth2/authorize?${query}`;
  };

  const getToken = async code => {
    try {
      const { accessToken } = await Dropbox.getToken({
        code,
        clientId: env.DROPBOX_APP_KEY,
        clientSecret: env.DROPBOX_APP_SECRET,
      });

      callMain(dropboxAuthorized, { accessToken });

      setAccessToken(accessToken);
      setStage(Stage.authorized);
    } catch (error) {
      await callMain(dropboxUnauthorize);
      setAccessToken(null);
      setStage(Stage.unauthorized);
    }
  };

  const revokeToken = async () => {
    try {
      await Dropbox.revokeToken({ accessToken });
    } catch (error) {
    } finally {
      console.log('Revoking token and setting stage to "unatuhorized"');
      setAccessToken(null);
      setStage(Stage.unauthorized);
      callMain(dropboxUnauthorize);
    }
  };

  const providerValue = useMemo(
    () => ({
      stage,
      Stage,
      currentAccount,
      listFolder,
      getAccount,
      getAuthorizeEndpoint,
      getToken,
      revokeToken,
    }),
    [stage, currentAccount],
  );

  return (
    <DropboxContext.Provider value={providerValue}>
      {children}
    </DropboxContext.Provider>
  );
}

export { DropboxContext, DropboxProvider };
