import React from 'react';

function FolderList({ items, onItemClick, renderIcon, renderEmpty }) {
  return items.length > 0 ? (
    <ul>
      {items.map(item => (
        <li key={item.path}>
          <button type="button" onClick={() => onItemClick(item)}>
            {renderIcon && <span>{renderIcon(item)}</span>}
            <span>{item.name}</span>
          </button>
        </li>
      ))}
    </ul>
  ) : (
    renderEmpty()
  );
}

FolderList.defaultProps = {
  renderEmpty: () => null,
};

export { FolderList };
