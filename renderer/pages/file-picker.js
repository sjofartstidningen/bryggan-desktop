import React, { useEffect, useState, useMemo, useContext } from 'react';
import Router from 'next/router';
import { CancelToken, isCancel } from 'axios';
import { DropboxContext } from '../context/DropboxContext';
import { Header } from '../components/Header';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FolderList } from '../components/FolderList';
import { Folder, File, IdFile } from '../components/FolderItem';
import { Sticky } from '../components/Sticky';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { sortByType } from '../utils';
import { minutes } from '../../shared/time';
import { useInterval, useWindowEvent, useWindowKeypress } from '../hooks';
import { callMain } from '../utils/ipc';
import {
  filePickerGetShowAllFiles,
  filePickerGetInitialPath,
  filePickerShowAllFilesUpdated,
  filePickerInitialPathUpdated,
  openFolder,
  openFile,
  openInddFile,
} from '../../shared/ipc-channels';

const filterRelevant = showAll => item =>
  showAll || item.type === 'folder' || item.name.endsWith('.indd');

function FilePicker() {
  const dropbox = useContext(DropboxContext);
  const [stage, setStage] = useState('initial');
  const [showAll, setShowAll] = useState(false);
  const [currentPath, setCurrentPath] = useState(null);
  const [folderContent, setFolderContent] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      callMain(filePickerGetShowAllFiles),
      callMain(filePickerGetInitialPath),
    ])
      .then(([{ showAllFiles }, { initialPath }]) => {
        setShowAll(showAllFiles || false);
        setCurrentPath(initialPath || '/');
      })
      .catch(error => {
        setError(error);
        setStage('error');
      });
  }, []);

  const onListFolderSuccess = ({ items }) => {
    setFolderContent(items);
    setError(null);
    setStage('at-rest');
  };

  const onListFolderError = error => {
    if (!isCancel(error)) {
      setError(error);
      setStage('error');
    } else {
      setStage('at-rest');
    }
  };

  useEffect(
    () => {
      if (currentPath !== null && dropbox.stage === dropbox.Stage.authorized) {
        setStage('fetching');
        const controller = CancelToken.source();
        dropbox
          .listFolder(currentPath, {
            ignoreCache: false,
            cancelToken: controller.token,
          })
          .then(onListFolderSuccess)
          .catch(onListFolderError);

        return () => controller.cancel();
      }
    },
    [currentPath, dropbox.stage],
  );

  const refreshFolder = () => {
    if (currentPath != null && dropbox.stage === dropbox.Stage.authorized) {
      const controller = CancelToken.source();
      dropbox
        .listFolder(currentPath, {
          ignoreCache: true,
          cancelToken: controller.token,
        })
        .then(onListFolderSuccess)
        .catch(onListFolderError);
    }
  };

  const filteredFolderContent = useMemo(
    () => folderContent.filter(filterRelevant(showAll)).sort(sortByType),
    [folderContent, showAll],
  );

  const onFolderClick = path => {
    setCurrentPath(path);
    callMain(filePickerInitialPathUpdated, { initialPath: path });
  };

  const onShowAllClick = () => {
    setShowAll(!showAll);
    callMain(filePickerShowAllFilesUpdated, { showAllFiles: !showAll });
  };

  const onSignOutClick = async () => {
    setStage('initial');
    dropbox.revokeToken();
    Router.push('/authorize');
  };

  const onOpenFolder = () => callMain(openFolder, { path: currentPath });
  const onFileClick = path => callMain(openFile, { path });
  const onIdFileClick = path => callMain(openInddFile, { path });

  useInterval(refreshFolder, minutes(1).toMilliseconds(), [currentPath]);
  useWindowKeypress(114, refreshFolder, [currentPath]);
  useWindowEvent('focus', refreshFolder, [currentPath]);

  return (
    <div>
      <div style={{ zIndex: 1 }}>
        <Header />
      </div>

      <Sticky as="section" style={{ zIndex: 2 }}>
        <nav>
          <Breadcrumbs
            currentPath={currentPath || '/'}
            onPathClick={({ path }) => onFolderClick(path)}
          />
        </nav>
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
          <Button type="button" onClick={refreshFolder}>
            Refresh
          </Button>
        </ContextMenuItem>
        <ContextMenuItem>
          <Button type="button" onClick={onOpenFolder}>
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
        {stage === 'initial' && <Loading message={'Starting up'} />}
        {stage === 'fetching' && (
          <Loading message={'Fetching folder content'} />
        )}
        {stage === 'error' && <p>{error.message}</p>}
        {stage === 'at-rest' && (
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
            renderEmpty={() => <Loading message="No relevant files" />}
          />
        )}
      </main>
    </div>
  );
}

FilePicker.defaultProps = {
  initialPath: '/',
};

export default FilePicker;
