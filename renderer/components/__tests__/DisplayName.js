import React from 'react';
import { render, waitForElement, flushEffects } from 'react-testing-library';
import axios from 'axios';
import { callMain } from '../../utils/ipc';
import { getAccountCache } from '../../../shared/api/Dropbox';
import { DisplayName } from '../DisplayName';
import { getAccount } from '../../../__fixtures__/Dropbox';

jest.mock('axios');
jest.mock('../../utils/ipc.js');

axios.post.mockResolvedValue({ data: getAccount });
callMain.mockResolvedValue({ accessToken: 'foo' });

afterEach(() => {
  getAccountCache.clear();
});

describe('Component: <DisplayName />', () => {
  it('should render the display name of the requested account', async () => {
    const { getByText } = render(<DisplayName acountId="foo" />);
    flushEffects();
    await waitForElement(() => getByText(getAccount.name.display_name));
    expect(getByText(getAccount.name.display_name)).toBeInTheDocument();
  });
});
