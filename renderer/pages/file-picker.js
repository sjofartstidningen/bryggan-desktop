import { basename } from 'path';
import React, { useState, useMemo, useContext } from 'react';
import Router from 'next/router';
import { DropboxContext } from '../context/Dropbox';
import { Header } from '../components/Header';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FolderList } from '../components/FolderList';
import { Folder, File, IdFile } from '../components/FolderItem';
import { Sticky } from '../components/Sticky';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { useListFolder } from '../hooks/dropbox';
import { sortByType } from '../utils';
import { minutes } from '../../shared/time';
import { useCallMain } from '../hooks/ipc';
import { useInterval, useWindowEvent, useWindowKeypress } from '../hooks';
import { callMain } from '../utils/ipc';

const filterRelevant = showAll => item =>
  showAll || item.type === 'folder' || item.name.endsWith('.indd');

function FilePicker({ initialPath, showAllFiles }) {
  const dropbox = useContext(DropboxContext);
  const [showAll, setShowAll] = useState(() =>
    showAllFiles === 'true' ? true : false,
  );

  const {
    state,
    items,
    currentPath,
    error,
    goToPath,
    update,
    setState,
  } = useListFolder(initialPath);

  const filteredItems = useMemo(
    () => items.filter(filterRelevant(showAll)).sort(sortByType),
    [items, showAll],
  );

  const onFolderClick = path => () => goToPath(path);
  const onOpenFolder = () => callMain('open-folder', { path: currentPath });
  const onFileClick = path => () => callMain('open-file', { path });
  const onIdFileClick = path => () => callMain('open-indd-file', { path });

  useCallMain('dropbox-path-updated', { path: currentPath }, [currentPath]);
  useCallMain('show-all-files-updated', { showAllFiles: showAll }, [showAll]);
  useInterval(update, minutes(1).toMilliseconds(), [currentPath]);
  useWindowKeypress(114, update, [currentPath]);
  useWindowEvent('focus', update, [currentPath]);

  const onSignOutClick = async () => {
    try {
      setState('loading');
      await dropbox.revokeToken();
    } catch (err) {
      // Run everything even thoud revoke token might fail
    } finally {
      await callMain('dropbox-unauthorize');
      Router.push({ pathname: '/authorize' });
    }
  };

  return (
    <div>
      <div style={{ zIndex: 1 }}>
        <Header />
      </div>

      <Sticky as="section" style={{ zIndex: 2 }}>
        <nav>
          <Breadcrumbs
            currentPath={currentPath}
            onPathClick={({ path }) => goToPath(path)}
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
              onChange={() => setShowAll(!showAll)}
            />
            <span>Show all files</span>
          </label>
        </ContextMenuItem>
        <ContextMenuItem>
          <Button type="button" onClick={update}>
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
        {(state === 'initial' || state === 'fetching') && (
          <Loading
            threshold={500}
            message={`Fetching ${basename(currentPath)}`}
          />
        )}
        {state === 'error' && <p>{error.message}</p>}
        {state === 'success' && (
          <FolderList
            items={filteredItems}
            renderFolder={file => (
              <Folder file={file} onClick={onFolderClick(file.path)} />
            )}
            renderFile={file => (
              <File file={file} onClick={onFileClick(file.path)} />
            )}
            renderIndd={file => (
              <IdFile
                file={file}
                folderContent={items}
                onClick={onIdFileClick(file.path)}
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
