import React, { useState, useMemo } from 'react';
import { useReady } from '../hooks';
import { Header } from '../components/Header';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FolderList } from '../components/FolderList';
import { EmptyFolder } from '../components/EmptyFolder';
import { Folder, File, IdFile } from '../components/FolderItem';
import { Sticky } from '../components/Sticky';
import { useListFolder } from '../hooks/dropbox';
import { sortByType } from '../utils';

const filterRelevant = showAll => item =>
  showAll || item.type === 'folder' || item.name.endsWith('.indd');

function FilePicker() {
  useReady('file-picker');
  const [showAll, setShowAll] = useState(false);
  const { state, items, currentPath, error, goToPath } = useListFolder(
    '/Tidningen/2018/11',
  );

  const filteredItems = useMemo(
    () => items.filter(filterRelevant(showAll)).sort(sortByType),
    [items, showAll],
  );

  const onFolderClick = path => () => goToPath(path);
  const onFileClick = path => () => {
    const ipc = require('electron-better-ipc');
    ipc.callMain('open-file', { path });
  };
  const onIdFileClick = path => () => {
    const ipc = require('electron-better-ipc');
    ipc.callMain('open-id-file', { path });
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

      <div>
        <label htmlFor="cb-show-all">
          <input
            type="checkbox"
            id="cb-show-all"
            checked={showAll}
            onChange={() => setShowAll(!showAll)}
          />
          <span>Show all files</span>
        </label>
      </div>

      <main style={{ zIndex: 1 }}>
        {state === 'initial' && <p>Loading</p>}
        {state === 'fetching' && <p>Loading</p>}
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
            renderEmpty={() => <EmptyFolder />}
          />
        )}
      </main>
    </div>
  );
}

export default FilePicker;
