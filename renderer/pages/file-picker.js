import React, { useState, useMemo } from 'react';
import { useReady } from '../hooks';
import { Header } from '../components/Header';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FolderList } from '../components/FolderList';
import { EmptyFolder } from '../components/EmptyFolder';
import { Folder, File, IdFile } from '../components/Icon';
import { useListFolder } from '../hooks/dropbox';

function FilePicker() {
  const [showAll, setShowAll] = useState(false);
  const { state, items, currentPath, error, goToPath } = useListFolder({
    initialPath: '/',
    apiKey: process.env.DROPBOX_API_KEY,
  });

  const filteredItems = useMemo(
    () =>
      items
        .filter(
          item =>
            showAll || item.type === 'folder' || item.name.endsWith('.indd'),
        )
        .sort((a, b) => {
          // Sort order is Folders before files, then alphabetically
          if (a.type !== b.type) return a.type > b.type ? -1 : 1;
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        }),
    [items, showAll],
  );

  useReady('file-picker');

  return (
    <div>
      <Header />
      <section>
        <nav>
          <Breadcrumbs
            currentPath={currentPath}
            onPathClick={({ path }) => goToPath(path)}
          />
        </nav>

        <label htmlFor="checkbox-show-all">
          <input
            type="checkbox"
            checked={showAll}
            onChange={() => setShowAll(!showAll)}
          />
          <span>Show all files</span>
        </label>
      </section>

      <main>
        {state === 'initial' && <p>Loading</p>}
        {state === 'fetching' && <p>Loading</p>}
        {state === 'error' && <p>{error.message}</p>}
        {state === 'success' && (
          <FolderList
            items={filteredItems}
            onItemClick={({ path }) => goToPath(path)}
            renderIcon={({ type, name }) =>
              name.endsWith('.indd') ? (
                <IdFile />
              ) : type === 'folder' ? (
                <Folder />
              ) : (
                <File />
              )
            }
            renderEmpty={() => <EmptyFolder />}
          />
        )}
      </main>
    </div>
  );
}

export default FilePicker;
