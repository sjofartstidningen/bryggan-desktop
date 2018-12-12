import { app, shell } from 'electron';
import { join } from 'path';
import execa from 'execa';
import fs from 'fs';
import { promisify } from 'util';
import { getLatestVersion } from './indesign';

const readFile = promisify(fs.readFile);

const getDropboxRoot = async () => {
  try {
    const homeDir = app.getPath('home');
    const dropboxInfo = join(homeDir, '.dropbox/info.json');
    const content = await readFile(dropboxInfo, 'utf-8');
    const data = JSON.parse(content);
    return data.business.path;
  } catch (err) {
    throw new Error('Could not find Dropbox root folder');
  }
};

async function openDropboxFolder(path) {
  try {
    const dropboxRoot = await getDropboxRoot();
    const fullPath = join(dropboxRoot, path);
    shell.showItemInFolder(fullPath);
  } catch (error) {
    throw new Error(`Could not locate or open ${path}`);
  }
}

async function openDropboxFile(path) {
  try {
    const dropboxRoot = await getDropboxRoot();
    const fullPath = join(dropboxRoot, path);
    shell.openItem(fullPath);
  } catch (error) {
    throw new Error(`Could not locate or open ${path}`);
  }
}

async function openDropboxIndesignFile(path) {
  try {
    const dropboxRoot = await getDropboxRoot();
    const fullPath = join(dropboxRoot, path);
    const { app: indesign } = await getLatestVersion();

    await execa('open', ['-a', indesign, fullPath]);
  } catch (error) {
    throw new Error(`Could not locate or open ${path}`);
  }
}

export { openDropboxFolder, openDropboxFile, openDropboxIndesignFile };
