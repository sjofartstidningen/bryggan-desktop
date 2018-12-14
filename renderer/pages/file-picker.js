import React, { useState, useMemo } from 'react';
import Router from 'next/router';
import * as Dropbox from '../../shared/api/Dropbox';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FetchIndicator } from '../components/FetchIndicator';
import { FolderList } from '../components/FolderList';
import { Folder, File, IdFile } from '../components/FolderItem';
import { Sticky } from '../components/Sticky';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { sortByType } from '../utils';
import { minutes } from '../../shared/time';
import {
  useInterval,
  useWindowEvent,
  useWindowKeypress,
  useMainStore,
} from '../hooks';
import { callMain } from '../utils/ipc';
import {
  filePickerShowAllFilesUpdated,
  filePickerInitialPathUpdated,
  openFolder,
  openFile,
  openInddFile,
  dropboxUnauthorize,
} from '../../shared/ipc-channels';
import { useListFolder, ListFolderStage } from '../hooks/dropbox';

const filterRelevant = showAll => item =>
  showAll || item.type === 'folder' || item.name.endsWith('.indd');

function FilePicker({ accessToken, initialPath, showAllFiles }) {
  const {
    stage,
    currentPath,
    folderContent,
    error,
    setPath,
    refreshCurrentPath,
  } = useListFolder({ accessToken, initialPath });
  const [showAll, setShowAll] = useState(() => showAllFiles);

  const filteredFolderContent = useMemo(
    () => folderContent.filter(filterRelevant(showAll)).sort(sortByType),
    [folderContent, showAll],
  );

  const onFolderClick = path => {
    setPath(path);
    callMain(filePickerInitialPathUpdated, { initialPath: path });
  };

  const onShowAllClick = () => {
    setShowAll(!showAll);
    callMain(filePickerShowAllFilesUpdated, { showAllFiles: !showAll });
  };

  const onSignOutClick = async () => {
    await Dropbox.revokeToken({ accessToken });
    await callMain(dropboxUnauthorize);
    Router.push('/authorize');
  };

  const onOpenFolderClick = () => callMain(openFolder, { path: currentPath });
  const onFileClick = path => callMain(openFile, { path });
  const onIdFileClick = path => callMain(openInddFile, { path });

  useInterval(refreshCurrentPath, minutes(1).toMilliseconds(), [currentPath]);
  useWindowKeypress(114, refreshCurrentPath, [currentPath]);
  useWindowEvent('focus', refreshCurrentPath, [currentPath]);

  return (
    <div>
      <Sticky as="section" style={{ zIndex: 2 }}>
        <nav>
          <Breadcrumbs
            currentPath={currentPath || '/'}
            onPathClick={({ path }) => onFolderClick(path)}
          />
        </nav>
        <FetchIndicator isFetching={stage === ListFolderStage.fetching} />
      </Sticky>

      <ContextMenu zIndex={4}>
        <ContextMenuItem>
          <label htmlFor="cb-show-all">
            <input
              type="checkbox"
              id="cb-show-all"
              checked={showAll}
              onChange={onShowAllClick}
            />
            <span>Show all files</span>
          </label>
        </ContextMenuItem>
        <ContextMenuItem>
          <Button type="button" onClick={refreshCurrentPath}>
            Refresh
          </Button>
        </ContextMenuItem>
        <ContextMenuItem>
          <Button type="button" onClick={onOpenFolderClick}>
            Open current folder
          </Button>
        </ContextMenuItem>
        <ContextMenuItem>
          <Button type="button" onClick={onSignOutClick}>
            Sign out
          </Button>
        </ContextMenuItem>
      </ContextMenu>

      <main style={{ zIndex: 1 }}>
        {stage === ListFolderStage.initial && (
          <Loading message={'Starting up'} />
        )}
        {stage === ListFolderStage.error && <p>{error.message}</p>}
        {(stage === ListFolderStage.success ||
          stage === ListFolderStage.fetching) && (
          <FolderList
            items={filteredFolderContent}
            renderFolder={file => (
              <Folder file={file} onClick={() => onFolderClick(file.path)} />
            )}
            renderFile={file => (
              <File file={file} onClick={() => onFileClick(file.path)} />
            )}
            renderIndd={file => (
              <IdFile
                file={file}
                folderContent={folderContent}
                onClick={() => onIdFileClick(file.path)}
              />
            )}
            renderEmpty={() => (
              <Loading
                message={
                  stage === 'fetching' && filteredFolderContent.length < 1
                    ? 'Fetching'
                    : 'No relevant files'
                }
              />
            )}
          />
        )}
      </main>
    </div>
  );
}

FilePicker.defaultProps = {
  initialPath: '/',
  showAllFiles: false,
};

const FilePickerWrapper = () => {
  const { settled, response, error } = useMainStore([
    'initialPath',
    'showAllFiles',
    'accessToken',
  ]);

  if (settled && response && !response.accessToken) {
    Router.push({
      pathname: '/authorize',
      query: { from: '/file-picker' },
    });
  }

  return (
    <div>
      <main style={{ zIndex: 1 }}>
        {!settled && <Loading message="Starting up" />}
        {settled && error && <p>{error.message}</p>}
        {settled && response && <FilePicker {...response} />}
      </main>
    </div>
  );
};

export default FilePickerWrapper;
