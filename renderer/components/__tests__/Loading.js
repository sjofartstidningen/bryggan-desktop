import React from 'react';
import { flushEffects, waitForElement } from 'react-testing-library';
import { renderWithTheme } from '../../../tests/utils';
import { Loading } from '../Loading';

describe('Component: <Loading />', () => {
  it('should render a loader', () => {
    const { container, getByText } = renderWithTheme(<Loading />);
    expect(getByText(/loading/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should be able to render only after a threshold', async () => {
    const { getByText } = renderWithTheme(<Loading threshold={10} />);

    expect(() => getByText(/loading/i)).toThrow();

    flushEffects();
    await waitForElement(() => getByText(/loading/i));

    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  it('should accept a message to supply the loading indicator', () => {
    const message = 'Hello I am loading';
    const { getByText } = renderWithTheme(<Loading message={message} />);
    expect(getByText(message)).toBeInTheDocument();
  });
});
