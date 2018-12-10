import axios from 'axios';
import { createSimpleCache } from '../utils';

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

const listFolderCache = createSimpleCache();

async function listFolder(path, { apiKey, cancelToken, ignoreCache } = {}) {
  if (typeof apiKey !== 'string') {
    throw new Error('An api key is required to request folder contents');
  }

  let data;

  if (!ignoreCache && listFolderCache.has(path)) {
    data = listFolderCache.get(path);
  } else {
    const response = await axios.post(
      'https://api.dropboxapi.com/2/files/list_folder',
      { path: path === '/' ? '' : path },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        cancelToken,
      },
    );

    data = response.data;
    listFolderCache.set(path, data);
  }

  return { items: normalizeFolderContent(data.entries) };
}

export { listFolder, listFolderCache };
