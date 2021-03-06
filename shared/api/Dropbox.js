import axios from 'axios';
import log from 'electron-log';
import { createSimpleCache } from '../../shared/simple-cache';
import { minutes, days } from '../../shared/time';

function logWrapper(endpoint, fn) {
  return async (...args) => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      if (error.response) {
        let reason;

        if (error.response.status === 409) {
          reason =
            error.response.data.user_message ||
            error.response.data.error_summary ||
            error.response.data.error;
        } else {
          reason = error.response.statusText;
        }

        log.error(`${endpoint}: Failed request because: ${reason}`);
      } else {
        log.error(`${endpoint}: Failed request: ${error.message}`);
      }

      throw error;
    }
  };
}

const checkAccessToken = accessToken => {
  if (typeof accessToken !== 'string') {
    throw new Error('An access token is required to request folder contents');
  }
};

const constructHeaders = accessToken => ({
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
});

const normalizeFolderContent = entries =>
  entries
    .map(entry => {
      const type = entry['.tag'];

      switch (type) {
        case 'folder':
          return {
            type,
            id: entry.id,
            name: entry.name,
            path: entry.path_display,
          };
        case 'file':
          return {
            type,
            id: entry.id,
            name: entry.name,
            path: entry.path_display,
            clientModified: entry.client_modified,
            serverModified: entry.server_modified,
            modifiedBy: entry.sharing_info && entry.sharing_info.modified_by,
          };
        default:
          return null;
      }
    })
    .filter(Boolean);

const normalizeAccountData = data => ({
  id: data.account_id,
  displayName: `${data.name.given_name} ${data.name.surname}`,
  profilePhotoUrl: data.profile_photo_url,
});

const listFolderCache = createSimpleCache(minutes(1).toMilliseconds());

const listFolder = logWrapper(
  '/list_folder',
  async (path, { accessToken, cancelToken, ignoreCache } = {}) => {
    checkAccessToken(accessToken);

    let data;

    if (!ignoreCache && listFolderCache.has(path)) {
      data = listFolderCache.get(path);
    } else {
      const response = await axios.post(
        'https://api.dropboxapi.com/2/files/list_folder',
        { path: path === '/' ? '' : path },
        {
          headers: constructHeaders(accessToken),
          cancelToken,
        },
      );

      data = response.data;
      listFolderCache.set(path, data);
    }

    return { items: normalizeFolderContent(data.entries) };
  },
);

const getAccountCache = createSimpleCache(days(1).toMilliseconds());

const getAccount = logWrapper(
  '/get_account',
  async (accountId, { accessToken, cancelToken, ignoreCache }) => {
    checkAccessToken(accessToken);

    let data;

    if (!ignoreCache && getAccountCache.has(accountId)) {
      data = getAccountCache.get(accountId);
    } else {
      const response = await axios.post(
        'https://api.dropboxapi.com/2/users/get_account',
        { account_id: accountId },
        {
          headers: constructHeaders(accessToken),
          cancelToken,
        },
      );

      data = response.data;
      getAccountCache.set(accountId, data);
    }
    return {
      account: normalizeAccountData(data),
    };
  },
);

const getCurrentAccount = logWrapper(
  '/get_current_account',
  async ({ accessToken, cancelToken }) => {
    checkAccessToken(accessToken);

    const { data } = await axios.post(
      'https://api.dropboxapi.com/2/users/get_current_account',
      undefined,
      {
        headers: constructHeaders(accessToken),
        cancelToken,
      },
    );

    getAccountCache.set(data.account_id, data);

    return {
      account: normalizeAccountData(data),
    };
  },
);

const getToken = logWrapper(
  '/token',
  async ({ code, clientId, clientSecret }) => {
    const { data } = await axios.post(
      'https://api.dropboxapi.com/oauth2/token',
      undefined,
      {
        params: {
          code,
          grant_type: 'authorization_code',
        },
        auth: {
          username: clientId,
          password: clientSecret,
        },
      },
    );

    return { accessToken: data.access_token };
  },
);

const revokeToken = logWrapper('/revoke', async ({ accessToken }) => {
  await axios.post(
    'https://api.dropboxapi.com/2/auth/token/revoke',
    undefined,
    {
      headers: constructHeaders(accessToken),
    },
  );
});

export {
  listFolderCache,
  listFolder,
  getAccountCache,
  getAccount,
  getCurrentAccount,
  getToken,
  revokeToken,
};
