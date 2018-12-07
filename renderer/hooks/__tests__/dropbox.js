import React from 'react';
import {
  render,
  flushEffects,
  waitForElement,
  fireEvent,
} from 'react-testing-library';
import { __setResponseData } from 'axios';
import { useListFolder } from '../dropbox';
import { filesListFolder } from '../../__fixtures__/Dropbox';

jest.mock('axios');
__setResponseData({ data: filesListFolder });

describe('hook: useListFolder', () => {
  const Comp = () => {
    const { state, currentPath, items, error, goToPath } = useListFolder({
      initialPath: '/',
      apiKey: 'foo',
    });

    if (state === 'initial' || state === 'fetching') return <p>Loading</p>;
    if (state === 'error') return <p>{error.message}</p>;

    return (
      <div>
        <h1>{currentPath}</h1>
        <div>
          {items.map(item => (
            <button key={item.id} onClick={() => goToPath(item.path)}>
              {item.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  it('should fetch folder contents in provided folder', async () => {
    const { getByText } = render(<Comp />);

    expect(getByText(/loading/i)).toBeInTheDocument();

    await flushEffects();

    const folder = filesListFolder.entries.find(
      item => item['.tag'] === 'folder',
    );

    await waitForElement(() => getByText(folder.name));

    fireEvent.click(getByText(folder.name));

    await flushEffects();
    await waitForElement(() => getByText(folder.name));
    expect(getByText(folder.path_display)).toBeInTheDocument();
  });
});
