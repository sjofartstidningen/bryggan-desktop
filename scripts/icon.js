#!/usr/bin/env node
const execa = require('execa');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const stat = promisify(fs.stat);

const isDirectory = async path => {
  try {
    const Stat = await stat(path);
    return Stat.isDirectory();
  } catch (err) {
    return false;
  }
};

const processIcon = async name => {
  try {
    const iconsetPath = path.join(
      __dirname,
      `../resources/icons/${name}.iconset`,
    );
    const icnsPath = path.join(__dirname, `../build/${name}.icns`);

    const isDir = await isDirectory(iconsetPath);

    if (!isDir) {
      throw new Error(
        `You must export the iconset for "${name}" from Illustrator first`,
      );
    }

    await execa('iconutil', ['-c', 'icns', '-o', icnsPath, iconsetPath]);
    return {
      source: iconsetPath,
      export: icnsPath,
      success: true,
      name,
    };
  } catch (error) {
    return {
      name,
      success: false,
      reason: error.message,
    };
  }
};

(async () => {
  try {
    const icons = process.argv.slice(2);
    const result = await Promise.all(icons.map(name => processIcon(name)));
    console.log('Creating icons from iconsets');

    result.forEach(res => {
      if (res.success) console.log(`${res.name}: 👍`);
      if (!res.success) console.log(`${res.name}: 👎 (${res.reason})`);
    });
  } catch (error) {
    console.error(error.message);
  }
})();
