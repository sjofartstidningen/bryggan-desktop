import { shell } from 'electron';
import { join } from 'path';
import { openIndesignFile } from './indesign';
import { getDropboxRoot } from './dropbox';

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
    await openIndesignFile(fullPath);
  } catch (error) {
    throw new Error(`Could not locate or open ${path}`);
  }
}

export { openDropboxFolder, openDropboxFile, openDropboxIndesignFile };
