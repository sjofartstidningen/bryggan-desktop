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

export { sortByType };
