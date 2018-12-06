import React from 'react';

function GoogleFonts({ fonts }) {
  const fontsFragment = fonts
    .map(font => {
      let name = font.name.replace(/\s/g, '+');
      if (font.weights) {
        name += `:${font.weights.join(',')}`;
      }

      return name;
    })
    .join('|');

  const href = `https://fonts.googleapis.com/css?family=${fontsFragment}`;

  return <link key="google-fonts" rel="stylesheet" href={href} />;
}

export { GoogleFonts };
