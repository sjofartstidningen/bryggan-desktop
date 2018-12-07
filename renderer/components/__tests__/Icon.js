import React from 'react';
import { renderAndMatch } from '../../../tests/utils';
import * as Icon from '../Icon';

Object.entries(Icon).forEach(([name, Comp]) => {
  describe(`Component: <Icon.${name} />`, () => {
    if (name === 'Icon') {
      renderAndMatch(
        <Comp>
          <circle cx="12" cy="12" r="10" />
        </Comp>,
      );
    } else {
      renderAndMatch(<Comp />);
    }
  });
});
