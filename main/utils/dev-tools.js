import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import { is } from 'electron-util';

async function installDevTools() {
  if (!is.development) return;

  try {
    const tools = [REACT_DEVELOPER_TOOLS];
    await Promise.all(tools.map(tool => installExtension(tool)));
  } catch (err) {
    console.error(err.message);
  }
}

export { installDevTools };
