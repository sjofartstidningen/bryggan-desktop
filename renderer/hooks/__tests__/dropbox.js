import React from 'react';
import {
  render,
  flushEffects,
  waitForElement,
  fireEvent,
} from 'react-testing-library';
import axios from 'axios';
import { useListFolder } from '../dropbox';
import { filesListFolder } from '../../__fixtures__/Dropbox';
import { Provider as DropboxProvider } from '../../context/Dropbox';

jest.mock('axios');

describe('hook: useListFolder', () => {
  const Comp = () => {
    const { state, currentPath, items, error, goToPath } = useListFolder('/');

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
    axios.post.mockImplementation(() =>
      Promise.resolve({ data: filesListFolder }),
    );

    const { getByText } = render(
      <DropboxProvider apiKey="foo">
        <Comp />
      </DropboxProvider>,
    );

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
