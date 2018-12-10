import React, { Fragment, useRef, useMemo, useEffect } from 'react';
import { join } from 'path';
import styled, { css } from 'styled-components';
import { hideVisually } from 'polished';
import { Home } from './Icon';

const last = arr => arr[arr.length - 1];

const Wrapper = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  list-style: none;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    sans-serif;
  font-size: 0.75rem;
  color: rgb(68, 68, 68);
  background-color: rgb(250, 251, 252);
  overflow-x: scroll;
  padding: 0.5rem 0;
  transition: padding 0.3s ease-in-out;

  &::-webkit-scrollbar {
    display: none;
  }

  .sticky & {
    padding-top: calc(var(--electron-safe-inset, 0));
  }
`;

const BreadcrumbItem = styled.li`
  position: relative;
  white-space: nowrap;

  &:not(:last-child)::after {
    content: '>';
    color: rgb(114, 121, 129);
  }
`;

const BreadcrumbButton = styled.button`
  margin: 0;
  border: none;
  padding: 0 0.25rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  color: rgb(68, 68, 68);
  background-color: transparent;
  cursor: pointer;

  &:hover {
    color: rgb(0, 0, 0);
  }

  &:focus {
    outline: none;
  }

  ${p =>
    p.active &&
    css`
      color: rgb(0, 0, 0);
      font-weight: 600;
    `}
`;

const Hidden = styled.span`
  ${hideVisually()};
`;

function Breadcrumbs({ currentPath, onPathClick }) {
  const wrapper = useRef(null);
  const fragments = useMemo(
    () =>
      currentPath
        .split(/\//g)
        .filter(Boolean)
        .reduce(
          (paths, folder) => {
            const lastFolderPath = last(paths).path;
            return [
              ...paths,
              { path: join('/', lastFolderPath, folder), name: folder },
            ];
          },
          [{ path: '/', name: 'Home' }],
        ),
    [currentPath],
  );

  useEffect(
    () => {
      const frameId = requestAnimationFrame(() => {
        const elem = wrapper.current;
        const { width } = elem.getBoundingClientRect();
        elem.scrollLeft = width;
      });

      return () => cancelAnimationFrame(frameId);
    },
    [currentPath],
  );

  return (
    <Wrapper ref={wrapper}>
      {fragments.map(frag => (
        <BreadcrumbItem key={frag.path}>
          <BreadcrumbButton
            type="button"
            title={frag.path}
            active={frag.path === currentPath}
            onClick={() => onPathClick(frag)}
          >
            {frag.path === '/' ? (
              <Fragment>
                <Home />
                <Hidden>{frag.name}</Hidden>
              </Fragment>
            ) : (
              frag.name
            )}
          </BreadcrumbButton>
        </BreadcrumbItem>
      ))}
    </Wrapper>
  );
}

export { Breadcrumbs };
