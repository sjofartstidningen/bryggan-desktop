import { app } from 'electron';
import { is } from 'electron-util';

const loadRoute = (win, routeName, devtools = false) => {
  if (is.development) {
    win.loadURL(`http://localhost:8000/${routeName}`);
    if (devtools) win.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(`${app.getAppPath()}/renderer/out/${routeName}/index.html`);
  }
};

export { loadRoute };
