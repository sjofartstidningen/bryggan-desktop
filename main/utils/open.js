import { shell } from 'electron';
import log from 'electron-log';
import { join, dirname, basename } from 'path';
import { openIndesignFile } from './indesign';
import { getDropboxRoot } from './dropbox';
import { listFolder } from '../../shared/api/Dropbox';
import { store } from '../store';
import { hasIdlkFile } from '../../shared/utils';

async function openDropboxFolder(path) {
  try {
    const dropboxRoot = await getDropboxRoot('business');
    const fullPath = join(dropboxRoot, path);
    shell.showItemInFolder(fullPath);
  } catch (error) {
    throw new Error(`Could not locate or open ${path}`);
  }
}

async function openDropboxFile(path) {
  try {
    const dropboxRoot = await getDropboxRoot('business');
    const fullPath = join(dropboxRoot, path);
    shell.openItem(fullPath);
  } catch (error) {
    throw new Error(`Could not locate or open ${path}`);
  }
}

async function openDropboxIndesignFile(path) {
  try {
    const dropboxRoot = await getDropboxRoot('business');
    const fullPath = join(dropboxRoot, path);
    await openIndesignFile(fullPath);
  } catch (error) {
    throw new Error(`Could not locate or open ${path}`);
  }
}

async function openLocalIndesignFile(path) {
  try {
    const dropboxRoot = await getDropboxRoot('business');

    /**
     * Normalize both paths to similar standard since the are not the same
     * to begin with.
     * This caused some real trouble when comparing the two strings when one
     * represented "ö" as "ö" and the other as "0\u0308".
     */
    const normalizedPath = path.normalize('NFC');
    const normalizeDropboxRoot = dropboxRoot.normalize('NFC');

    const isInsideDropboxFolder = normalizedPath.includes(normalizeDropboxRoot);
    const accessToken = store.get('accessToken');

    if (!isInsideDropboxFolder || !accessToken) {
      /**
       * If the file is not from within a Dropbox folder the checks can be
       * ignored and we can let Dropbox do the checks
       */
      log.verbose(`Opening file ${path} as local`);
      await openIndesignFile(path);
    } else {
      /**
       * If the file lives within the dropbox folder we will first check for
       * existing *.idlk files and if the don't exist open it as normal, or if
       * it exists – prevent it from being opened
       */
      log.verbose(`Will try opening file ${path} as Dropbox file`);
      const dropboxDir = dirname(
        normalizedPath.replace(normalizeDropboxRoot, ''),
      );
      const { items } = await listFolder(dropboxDir, {
        accessToken,
        ignoreCache: true,
      });
      const isLocked = hasIdlkFile({ name: basename(path) }, items);

      if (isLocked) {
        log.verbose(`File is locked`);
        throw new Error('File locked');
      }

      await openIndesignFile(path);
    }
  } catch (error) {
    throw new Error(`Could not locate or open ${path}`);
  }
}

export {
  openDropboxFolder,
  openDropboxFile,
  openDropboxIndesignFile,
  openLocalIndesignFile,
};
