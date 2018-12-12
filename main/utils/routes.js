import { app } from 'electron';
import { is } from 'electron-util';
import log from 'electron-log';

const loadRoute = ({ win, page, devtools = false } = {}) => {
  if (is.development) {
    const url = `http://localhost:8000/${page}`;
    win.loadURL(url);
    if (devtools) win.openDevTools({ mode: 'detach' });

    log.info(`Url "${url}" loaded in development mode`);
  } else {
    const file = `${app.getAppPath()}/renderer/out/${page}/index.html`;
    win.loadFile(file);
    log.info(`File "${file}" loaded in production mode`);
  }
};

export { loadRoute };
