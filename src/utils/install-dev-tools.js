import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';

async function installDevTools() {
  try {
    const installers = [REACT_DEVELOPER_TOOLS].map(ext =>
      installExtension(ext),
    );

    await Promise.all(installers);
  } catch (err) {
    console.error(err.message);
  }
}

export { installDevTools };
