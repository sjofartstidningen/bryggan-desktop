import React from 'react';
import { render } from 'react-testing-library';
import { GlobalStyle } from '../GlobalStyle';

describe('Component: <GlobalStyle />', () => {
  it('should render without issues', () => {
    render(<GlobalStyle />);
  });
});
