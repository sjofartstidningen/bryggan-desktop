import { render } from 'react-testing-library';

const renderAndMatch = (compName, comp) => {
  it(`<${compName} />: should render without issues`, () => {
    const { container } = render(comp);
    expect(container.firstChild).toMatchSnapshot();
  });
};

export { renderAndMatch };
