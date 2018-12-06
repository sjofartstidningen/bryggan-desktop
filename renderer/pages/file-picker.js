import React, { useState } from 'react';
import { useReady } from '../hooks';
import { Header } from '../components/Header';
import { Breadcrumbs } from '../components/Breadcrumbs';

const create = (type, name) => ({
  '.tag': type,
  name,
  path: `/tidningen/2018/11/${name.toLowerCase()}`,
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
        <ul>
          {folderContent.map(({ '.tag': type, name }) => (
            <li key={name}>
              <button>
                <span>{type}</span> {name}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default FilePicker;
