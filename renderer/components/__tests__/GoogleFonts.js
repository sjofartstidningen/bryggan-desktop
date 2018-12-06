import React from 'react';
import { renderAndMatch } from '../../../tests/utils';
import { GoogleFonts } from '../GoogleFonts';

describe('Component: <GoogleFonts />', () => {
  const fonts = [{ name: 'Roboto', weights: [500, 700] }, 'Roboto Mono'];
  renderAndMatch(<GoogleFonts fonts={fonts} />);
});
