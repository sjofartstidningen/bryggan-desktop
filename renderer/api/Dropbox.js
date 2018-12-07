import axios from 'axios';

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

async function listFolder(path, { apiKey, cancelToken } = {}) {
  if (typeof apiKey !== 'string') {
    throw new Error('An api key is required to request folder contents');
  }

  const response = await axios({
    url: 'https://api.dropboxapi.com/2/files/list_folder',
    method: 'post',
    data: { path: path === '/' ? '' : path },
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    cancelToken,
  });

  return { items: normalizeFolderContent(response.data.entries) };
}

export { listFolder };
