import { app } from 'electron';
import { is } from 'electron-util';
import qs from 'qs';

const loadRoute = ({ win, page, query = {}, devtools = false } = {}) => {
  const querystring = qs.stringify(query);

  if (is.development) {
    win.loadURL(`http://localhost:8000/${page}?${querystring}`);
    if (devtools) win.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(
      `${app.getAppPath()}/renderer/out/${page}/index.html?${querystring}`,
    );
  }
};

export { loadRoute };
