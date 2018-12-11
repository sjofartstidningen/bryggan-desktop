import React from 'react';
import { render } from 'react-testing-library';
import { ThemeProvider } from 'styled-components';
import * as theme from '../renderer/style/theme';

const renderWithTheme = comp =>
  render(<ThemeProvider theme={theme}>{comp}</ThemeProvider>);

const renderAndMatch = (comp, message = 'should render without issues') => {
  it(message, () => {
    const { container } = renderWithTheme(comp);
    expect(container.firstChild).toMatchSnapshot();
  });
};

export { renderAndMatch, renderWithTheme };
