'use strict';

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');
const { is } = require('electron-util');

async function installDevTools() {
  if (!is.development) return;

  try {
    const tools = [REACT_DEVELOPER_TOOLS];
    await Promise.all(tools.map(tool => installExtension(tool)));
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = { installDevTools };
