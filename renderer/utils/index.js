import path from 'path';

const sortByType = (a, b) => {
  if (a.type !== b.type) return a.type > b.type ? -1 : 1;

  const aExt = path.extname(a.name);
  const bExt = path.extname(b.name);
  if (aExt !== bExt) return aExt > bExt ? 1 : -1;
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
};

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

export { sortByType, hasIdlkFile };
