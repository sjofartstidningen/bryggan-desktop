import React from 'react';
import {
  render,
  flushEffects,
  waitForElement,
  fireEvent,
} from 'react-testing-library';
import axios from 'axios';
import { ListFolderStage, useListFolder } from '../dropbox';
import { filesListFolder } from '../../../__fixtures__/Dropbox';
import { listFolderCache } from '../../../shared/api/Dropbox';

jest.mock('axios');

axios.post.mockResolvedValue({ data: filesListFolder });

const TestComponent = () => {
  const {
    stage,
    currentPath,
    folderContent,
    error,
    setPath,
    refreshCurrentPath,
  } = useListFolder({ accessToken: 'foo', initialPath: '/' });

  return (
    <div>
      <h2>Current: {currentPath}</h2>
      {stage === ListFolderStage.initial && <p>Starting up</p>}
      {stage === ListFolderStage.fetching && <p>Loading</p>}
      {stage === ListFolderStage.error && <p>Error: {error.message}</p>}
      {stage === ListFolderStage.success && (
        <div>
          <p>
            <button type="button" onClick={refreshCurrentPath}>
              Refresh
            </button>
          </p>
          <ul>
            {folderContent.map(item => (
              <li key={item.id}>
                <button type="button" onClick={() => setPath(item.path)}>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

afterEach(() => {
  axios.post.mockClear();
  listFolderCache.clear();
});

describe('Hook: useListFolder', () => {
  it('should load the content of initial path after mounted', async () => {
    const { getByText } = render(<TestComponent />);

    expect(getByText('Starting up')).toBeInTheDocument();
    flushEffects();
    expect(getByText('Loading')).toBeInTheDocument();

    const itemName = filesListFolder.entries[0].name;
    await waitForElement(() => getByText(itemName));
    expect(getByText(itemName)).toBeInTheDocument();
  });

  it('should handle errors being thrown from api', async () => {
    const errorMessage = `Can't find path`;
    axios.post.mockRejectedValueOnce(new Error(errorMessage));
    const { getByText } = render(<TestComponent />);
    flushEffects();

    const messageRegExp = new RegExp(errorMessage);
    await waitForElement(() => getByText(messageRegExp));
    expect(getByText(messageRegExp)).toBeInTheDocument();
  });

  it('should update currentPath and fetch new content when calling setPath', async () => {
    const { getByText } = render(<TestComponent />);
    flushEffects();

    const { name, path } = filesListFolder.entries[0];
    const nameRegExp = new RegExp(name, 'i');
    const pathRegExp = new RegExp(path, 'i');

    await waitForElement(() => getByText(nameRegExp));
    expect(axios.post).toHaveBeenCalledTimes(1);

    fireEvent.click(getByText(nameRegExp));

    await waitForElement(() => getByText(pathRegExp));
    expect(getByText(pathRegExp)).toBeInTheDocument();
  });

  it('should handle refreshing current path when calling refreshCurrentPath', async () => {
    const { getByText } = render(<TestComponent />);
    flushEffects();

    const { name } = filesListFolder.entries[0];

    await waitForElement(() => getByText(name));

    fireEvent.click(getByText(/refresh/i));
    expect(axios.post).toHaveBeenCalledTimes(2);
  });
});
