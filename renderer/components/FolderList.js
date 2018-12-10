import { extname } from 'path';
import React from 'react';

function FolderList({
  items,
  onItemClick,
  renderFolder,
  renderFile,
  renderIndd,
  renderEmpty,
}) {
  return items.length > 0 ? (
    <ul>
      {items.map(item => {
        if (item.type === 'folder') {
          return <li key={item.path}>{renderFolder(item)}</li>;
        }

        if (extname(item.path) === '.indd') {
          return <li key={item.path}>{renderIndd(item)}</li>;
        }

        return <li key={item.path}>{renderFile(item)}</li>;
      })}
    </ul>
  ) : (
    renderEmpty()
  );
}

FolderList.defaultProps = {
  renderEmpty: () => null,
};

export { FolderList };
