import React from 'react';
import axios from 'axios';
import { render, flushEffects, waitForElement } from 'react-testing-library';
import { Provider } from '../../context/Dropbox';
import { getAccount } from '../../__fixtures__/Dropbox';
import { DisplayName } from '../DisplayName';

jest.mock('axios');

axios.post.mockResolvedValue({ data: getAccount });

describe('Component: <DisplayName />', () => {
  it('should render the display name of a provided account id', async () => {
    const { getByText } = render(
      <Provider apiKey="foo">
        <p>
          <DisplayName accountId="foo" />
        </p>
      </Provider>,
    );

    await flushEffects();
    await waitForElement(() => getByText(/adam bergman/i));

    expect(getByText(/adam bergman/i)).toBeInTheDocument();
  });
});
