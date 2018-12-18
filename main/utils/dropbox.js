import { join } from 'path';
import { app } from 'electron';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

const getDropboxRoot = async (type = 'business') => {
  if (type !== 'business' && type !== 'personal') {
    throw new Error(
      `type must be either 'business' or 'personal', got ${type}`,
    );
  }

  try {
    const homeDir = app.getPath('home');
    const dropboxInfo = join(homeDir, '.dropbox/info.json');
    const content = await readFile(dropboxInfo, 'utf-8');
    const data = JSON.parse(content);
    return data[type].path;
  } catch (err) {
    throw new Error('Could not find Dropbox root folder');
  }
};

export { getDropboxRoot };
