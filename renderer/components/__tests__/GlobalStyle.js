import React from 'react';
import { render } from 'react-testing-library';
import { GlobalStyle } from '../GlobalStyle';

it('<GlobalStye />: should render without issues', () => {
  render(<GlobalStyle />);
});
