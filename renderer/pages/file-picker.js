import React from 'react';
import { useReady } from '../hooks';
import { Header } from '../components/Header';

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
  useReady('file-picker');

  return (
    <div>
      <Header />
      <section>
        <nav>
          <ul>
            <li>
              <a href="/">Root</a>
            </li>
            <li>
              <a href="/Tidningen">Tidningen</a>
            </li>
            <li>
              <a href="/Tidningen/2018">2018</a>
            </li>
            <li>
              <a href="/Tidningen/2018/11">11</a>
            </li>
          </ul>
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
