import { shell } from 'electron';
import log from 'electron-log';
import { join, dirname, basename } from 'path';
import { openIndesignFile } from './indesign';
import { getDropboxRoot } from './dropbox';
import { listFolder } from '../../shared/api/Dropbox';
import { store } from '../store';
import { hasIdlkFile } from '../../renderer/utils';

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

async function openLocalIndesignFile(path) {
  try {
    console.log();
    const dropboxRoot = await getDropboxRoot();
    const isInsideDropboxFolder = path.match(/dropbox/gi);
    const accessToken = store.get('accessToken');

    console.log({
      correctDropboxRoot:
        dropboxRoot === '/Users/adam/Dropbox (Sjöfartstidningen)',
      dropboxRoot,
      isInsideDropboxFolder,
      accessToken,
    });

    if (!isInsideDropboxFolder || !accessToken) {
      log.verbose(`Opening file ${path} as local`);
      await openIndesignFile(path);
    } else {
      log.verbose(`Opening file ${path} as Dropbox file`);
      const dropboxDir = dirname(path.replace(dropboxRoot, ''));
      const { items } = await listFolder(dropboxDir, { accessToken });
      const isLocked = hasIdlkFile({ name: basename(path) }, items);
      if (isLocked) throw new Error('File locked');

      await openIndesignFile(path);
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Could not locate or open ${path}`);
  }
}

export {
  openDropboxFolder,
  openDropboxFile,
  openDropboxIndesignFile,
  openLocalIndesignFile,
};
