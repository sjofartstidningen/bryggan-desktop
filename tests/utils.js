import { render } from 'react-testing-library';

const renderAndMatch = (comp, message = 'should render without issues') => {
  it(message, () => {
    const { container } = render(comp);
    expect(container.firstChild).toMatchSnapshot();
  });
};

const requireCache = new Map();
const addPackageToRequire = (name, implementation) => {
  requireCache.set(name, implementation);

  const windowRequire = pkgName => {
    if (requireCache.has(pkgName)) return requireCache.get(pkgName);
    throw new Error(`Package '${pkgName}' not found`);
  };

  window.require = window.require || windowRequire;
};

export { renderAndMatch, addPackageToRequire };
