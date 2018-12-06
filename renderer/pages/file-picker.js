import React, { useState } from 'react';
import { useReady } from '../hooks';
import { Header } from '../components/Header';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FolderList } from '../components/FolderList';
import { EmptyFolder } from '../components/EmptyFolder';
import { Folder, File, IdFile } from '../components/Icon';

const create = (type, name) => ({
  type: type,
  name,
  path: `/Tidningen/2018/11/${name}`,
});

const folderContent = [
  create('folder', 'A'),
  create('folder', 'B'),
  create('folder', 'C'),
  create('folder', 'D'),
  create('folder', 'Framvagn'),
  create('folder', 'till tryckeriet'),
  create('file', 'ST_11_18_01_Framvagn.indd'),
  create('file', 'ST_11_18_02_A.indd'),
  create('file', 'ST_11_18_03_B.indd'),
  create('file', 'ST_11_18_04_C.indd'),
  create('file', 'ST_11_18_05_D.indd'),
];

function FilePicker() {
  const [currentPath, setCurrentPath] = useState('/Tidningen/2018/11');
  useReady('file-picker');

  const handleClick = item => {
    if (item.type === 'folder') {
      setCurrentPath(item.path);
    }
  };

  return (
    <div>
      <Header />
      <section>
        <nav>
          <Breadcrumbs
            currentPath={currentPath}
            onPathClick={({ path }) => setCurrentPath(path)}
          />
        </nav>
      </section>

      <main>
        <FolderList
          items={folderContent}
          onItemClick={handleClick}
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
      </main>
    </div>
  );
}

export default FilePicker;
