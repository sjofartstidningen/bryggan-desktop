import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { find } from 'styled-components/test-utils';
import { FolderList } from '../FolderList';
import { IconSvg, Home } from '../Icon';

describe('Component: <FolderList />', () => {
  it('should render a list of folder items', () => {
    const items = [
      { type: 'folder', name: 'A', path: '/Alphabet/A' },
      { type: 'folder', name: 'B', path: '/Alphabet/B' },
      { type: 'folder', name: 'C', path: '/Alphabet/C' },
      { type: 'file', name: 'text.txt', path: '/Alphabet/text.txt' },
    ];
    const { getByText } = render(<FolderList items={items} />);

    expect(getByText(/^A$/)).toBeInTheDocument();
    expect(getByText(/^text\.txt$/)).toBeInTheDocument();
  });

  it('should render a icon if provided', () => {
    const items = [
      { type: 'folder', name: 'A', path: '/Alphabet/A' },
      { type: 'folder', name: 'B', path: '/Alphabet/B' },
      { type: 'folder', name: 'C', path: '/Alphabet/C' },
      { type: 'file', name: 'text.txt', path: '/Alphabet/text.txt' },
    ];

    const { container } = render(
      <FolderList items={items} renderIcon={() => <Home />} />,
    );

    expect(find(container, IconSvg)).toBeInTheDocument();
  });

  it('should react to clicks on items', () => {
    const items = [
      { type: 'folder', name: 'A', path: '/Alphabet/A' },
      { type: 'file', name: 'text.txt', path: '/Alphabet/text.txt' },
    ];

    const onClick = jest.fn();

    const { getByText } = render(
      <FolderList
        items={items}
        renderIcon={() => <Home />}
        onItemClick={onClick}
      />,
    );

    fireEvent.click(getByText(/^A$/));

    expect(onClick).toHaveBeenCalled();
    expect(onClick).toHaveBeenLastCalledWith(items[0]);
  });

  it('should render an empty state if no items in folder', () => {
    const { getByText } = render(
      <FolderList items={[]} renderEmpty={() => <p>No items</p>} />,
    );
    expect(getByText(/no items/i)).toBeInTheDocument();
  });
});
