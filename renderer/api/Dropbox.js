import { fetch } from '../utils/fetch';

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

async function listFolder(path, { apiKey, signal } = {}) {
  if (typeof apiKey !== 'string') {
    throw new Error('An api key is required to request folder contents');
  }

  const url = 'https://api.dropboxapi.com/2/files/list_folder';
  const headers = {
    Authorization: `Bearer: ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const body = {
    path,
    recursive: false,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Could not fetch folder contents at ${path}`);
  }

  const json = await response.json();

  return { items: normalizeFolderContent(json.entries) };
}

export { listFolder };
