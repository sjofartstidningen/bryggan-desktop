import Store from 'electron-store';
import { is } from 'electron-util';
import pkg from '../package.json';

const store = new Store({
  encryptionKey: `${pkg.name}-${is.development ? 'dev' : 'prod'}`,
});

export { store };
