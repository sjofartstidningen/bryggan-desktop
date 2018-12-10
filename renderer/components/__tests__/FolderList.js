import React from 'react';
import { render } from 'react-testing-library';
import { FolderList } from '../FolderList';

describe('Component: <FolderList />', () => {
  it('should render a list of folder items', () => {
    const items = [
      { type: 'folder', name: 'A', path: '/Alphabet/A' },
      { type: 'folder', name: 'B', path: '/Alphabet/B' },
      { type: 'folder', name: 'C', path: '/Alphabet/C' },
      { type: 'file', name: 'text.txt', path: '/Alphabet/text.txt' },
    ];

    const renderFolder = jest.fn(({ name }) => <p>{name}</p>);
    const renderFile = jest.fn(({ name }) => <p>{name}</p>);

    render(
      <FolderList
        items={items}
        renderFolder={renderFolder}
        renderFile={renderFile}
      />,
    );

    expect(renderFolder).toHaveBeenCalledTimes(3);
    expect(renderFile).toHaveBeenCalledTimes(1);
  });

  it('should render call a special function for .indd-files', () => {
    const items = [
      { type: 'file', name: 'test.indd', path: '/InDesign/test.indd' },
      { type: 'file', name: 'test2.indd', path: '/InDesign/test2.indd' },
    ];

    const renderIndd = jest.fn(({ name }) => <p>{name}</p>);
    render(<FolderList items={items} renderIndd={renderIndd} />);

    expect(renderIndd).toHaveBeenCalledTimes(2);
  });

  it('should render an empty state if no items in folder', () => {
    const { getByText } = render(
      <FolderList items={[]} renderEmpty={() => <p>No items</p>} />,
    );
    expect(getByText(/no items/i)).toBeInTheDocument();
  });
});
