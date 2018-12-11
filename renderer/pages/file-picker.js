import { basename } from 'path';
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '../components/Header';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FolderList } from '../components/FolderList';
import { Folder, File, IdFile } from '../components/FolderItem';
import { Sticky } from '../components/Sticky';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';
import { Loading } from '../components/Loading';
import { useListFolder } from '../hooks/dropbox';
import { sortByType } from '../utils';
import { minutes } from '../../shared/time';
import { useCallMain } from '../hooks/ipc';
import { callMain } from '../utils/ipc';

const filterRelevant = showAll => item =>
  showAll || item.type === 'folder' || item.name.endsWith('.indd');

function FilePicker({ initialPath }) {
  const [showAll, setShowAll] = useState(false);
  const { state, items, currentPath, error, goToPath, update } = useListFolder(
    initialPath,
  );

  const filteredItems = useMemo(
    () => items.filter(filterRelevant(showAll)).sort(sortByType),
    [items, showAll],
  );

  const onFolderClick = path => () => goToPath(path);
  const onFileClick = path => () => callMain('open-file', { path });
  const onIdFileClick = path => () => callMain('open-id-file', { path });

  useCallMain('dropbox-path-updated', { path: currentPath }, [currentPath]);

  useEffect(
    () => {
      const onKeypress = e => {
        if (e.keyCode === 114) {
          e.preventDefault();
          update();
        }
      };

      window.addEventListener('keypress', onKeypress);
      return () => window.removeEventListener('keypress', onKeypress);
    },
    [currentPath],
  );

  useEffect(
    () => {
      const intervalId = setInterval(update, minutes(1).toMilliseconds());
      return () => clearInterval(intervalId);
    },
    [currentPath],
  );

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
