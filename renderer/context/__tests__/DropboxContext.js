import React, { useContext } from 'react';
import { render, flushEffects, waitForElement } from 'react-testing-library';
import { callMain } from '../../utils/ipc';
import { DropboxProvider, DropboxContext } from '../DropboxContext';

jest.mock('../../utils/ipc.js', () => ({
  callMain: jest.fn(),
}));

afterEach(() => {
  callMain.mockReset();
});

describe('Context: DropboxContext', () => {
  it.skip('should try to get an access token from the main thread', async () => {
    callMain
      .mockResolvedValueOnce({ accessToken: 'access_token' })
      .mockResolvedValueOnce({ initialPath: '/' });

    const Comp = () => {
      const dropbox = useContext(DropboxContext);
      return <p>{dropbox.signedIn() ? 'true' : 'false'}</p>;
    };

    const { getByText } = render(
      <DropboxProvider>
        <Comp />
      </DropboxProvider>,
    );

    flushEffects();

    await waitForElement(() => getByText(/true/));
    expect(getByText(/true/)).toBeInTheDocument();
  });
});
