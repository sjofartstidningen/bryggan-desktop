import React from 'react';
import { useReady } from '../hooks';
import { Header } from '../components/Header';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FolderList } from '../components/FolderList';
import { EmptyFolder } from '../components/EmptyFolder';
import { Folder, File, IdFile } from '../components/Icon';
import { useListFolder } from '../hooks/dropbox';

function FilePicker() {
  const { state, items, currentPath, error, goToPath } = useListFolder({
    initialPath: '/',
    apiKey: process.env.DROPBOX_API_KEY,
  });

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
      </section>

      <main>
        {state === 'initial' && <p>Loading</p>}
        {state === 'fetching' && <p>Loading</p>}
        {state === 'error' && <p>{error.message}</p>}
        {state === 'success' && (
          <FolderList
            items={items}
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
