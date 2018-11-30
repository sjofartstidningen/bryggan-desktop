import path from 'path';
import fs from 'fs';
import { nativeImage } from 'electron';

const iconCache = new Map();
const iconsRoot = path.join(__dirname, '../../static/icons');

const getIcon = name => {
  if (iconCache.has(name)) return iconCache.get(name);

  try {
    const iconPath = path.join(iconsRoot, name);
    fs.existsSync(iconPath, fs.constants.R_OK);

    const icon = nativeImage.createFromPath(iconPath);
    iconCache.set(name, icon);

    return icon;
  } catch (err) {
    throw new Error(`Icon ${name} can not be read`);
  }
};

export { getIcon, iconCache };
