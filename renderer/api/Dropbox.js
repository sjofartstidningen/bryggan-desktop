import axios from 'axios';
import { createSimpleCache } from '../../shared/simple-cache';
import { minutes, days } from '../../shared/time';

const checkApiKey = apiKey => {
  if (typeof apiKey !== 'string') {
    throw new Error('An api key is required to request folder contents');
  }
};

const construcHeaders = apiKey => ({
  Authorization: `Bearer ${apiKey}`,
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

const listFolderCache = createSimpleCache(minutes(1).toMilliseconds());

async function listFolder(path, { apiKey, cancelToken, ignoreCache } = {}) {
  checkApiKey(apiKey);

  let data;

  if (!ignoreCache && listFolderCache.has(path)) {
    data = listFolderCache.get(path);
  } else {
    const response = await axios.post(
      'https://api.dropboxapi.com/2/files/list_folder',
      { path: path === '/' ? '' : path },
      {
        headers: construcHeaders(apiKey),
        cancelToken,
      },
    );

    data = response.data;
    listFolderCache.set(path, data);
  }

  return { items: normalizeFolderContent(data.entries) };
}

const getAccountCache = createSimpleCache(days(1).toMilliseconds());

async function getAccount(accountId, { apiKey, cancelToken, ignoreCache }) {
  checkApiKey(apiKey);

  let data;

  if (!ignoreCache && getAccountCache.has(accountId)) {
    data = getAccountCache.get(accountId);
  } else {
    const response = await axios.post(
      'https://api.dropboxapi.com/2/users/get_account',
      { account_id: accountId },
      {
        headers: construcHeaders(apiKey),
        cancelToken,
      },
    );

    data = response.data;
    getAccountCache.set(accountId, data);
  }
  return {
    account: {
      id: data.account_id,
      displayName: data.name.display_name,
      profilePhotoUrl: data.profile_photo_url,
    },
  };
}

export { listFolderCache, listFolder, getAccountCache, getAccount };
