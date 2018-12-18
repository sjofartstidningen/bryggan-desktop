import path from 'path';

const hasIdlkFile = (file, items) => {
  /**
   * .idlk files are special in that the are somewhat similar to the original
   * filename – but not exactly
   * The original filename is capped at 18 chars and transformed to lower case
   * then wrapped in tildes: "~[original_filename]~[random_chars].idlk"
   */
  const basename = path
    .basename(file.name, '.indd')
    .slice(0, 18)
    .toLowerCase();

  for (const item of items) {
    if (path.extname(item.name) === '.idlk') {
      const [, strippedIdlkName] = item.name.match(/~(.+)~/);
      if (strippedIdlkName === basename) return true;
    }
  }

  return false;
};

export { hasIdlkFile };
