import { app } from 'electron';
import { is } from 'electron-util';
import log from 'electron-log';
import qs from 'qs';

const loadRoute = ({ win, page, query = {}, devtools = false } = {}) => {
  const querystring = qs.stringify(query);

  if (is.development) {
    const url = `http://localhost:8000/${page}?${querystring}`;
    win.loadURL(url);
    if (devtools) win.openDevTools({ mode: 'detach' });

    log.info(`Url "${url}" loaded in development mode`);
  } else {
    const file = `${app.getAppPath()}/renderer/out/${page}/index.html?${querystring}`;
    win.loadFile(file);
    log.info(`File "${file}" loaded in production mode`);
  }
};

export { loadRoute };
