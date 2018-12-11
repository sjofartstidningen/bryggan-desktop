import React from 'react';
import { fireEvent } from 'react-testing-library';
import { renderWithTheme } from '../../../tests/utils';
import { Breadcrumbs } from '../Breadcrumbs';

describe('Component: <Breadcrumbs />', () => {
  it('should render a list of breadcrumbs based on the current path', () => {
    const { queryAllByText } = renderWithTheme(
      <Breadcrumbs currentPath="/foo/bar/baz" />,
    );
    expect(queryAllByText(/\w+/)).toHaveLength(4);
  });

  it('should render only "Home" on currentPath="/"', () => {
    const { container } = renderWithTheme(<Breadcrumbs currentPath="/" />);
    expect(container.querySelectorAll('li')).toHaveLength(1);
  });

  it('should react to clicking on a fragment and passing the path', () => {
    const onClick = jest.fn();
    const { getByText } = renderWithTheme(
      <Breadcrumbs currentPath="/foo/bar/baz" onPathClick={onClick} />,
    );

    fireEvent.click(getByText(/bar/i));
    expect(onClick).toHaveBeenCalled();
    expect(onClick).toHaveBeenLastCalledWith({ name: 'bar', path: '/foo/bar' });
  });
});
