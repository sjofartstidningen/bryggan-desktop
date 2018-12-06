import { render } from 'react-testing-library';

const renderAndMatch = (comp, message = 'should render without issues') => {
  it(message, () => {
    const { container } = render(comp);
    expect(container.firstChild).toMatchSnapshot();
  });
};

export { renderAndMatch };
