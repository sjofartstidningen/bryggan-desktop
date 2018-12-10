import React, { useState, useMemo } from 'react';
import { useReady } from '../hooks';
import { Header } from '../components/Header';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FolderList } from '../components/FolderList';
import { EmptyFolder } from '../components/EmptyFolder';
import { Folder, File, IdFile } from '../components/Icon';
import { Sticky } from '../components/Sticky';
import { useListFolder } from '../hooks/dropbox';
import { sortByType } from '../utils';

const filterRelevant = showAll => item =>
  showAll || item.type === 'folder' || item.name.endsWith('.indd');

function FilePicker() {
  const { state, items, currentPath, error, goToPath } = useListFolder({
    initialPath: '/',
    apiKey: process.env.DROPBOX_API_KEY,
  });

  const filteredItems = useMemo(
    () => items.filter(filterRelevant(false)).sort(sortByType),
    [items],
  );

  useReady('file-picker');

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

      <main style={{ zIndex: 1 }}>
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
