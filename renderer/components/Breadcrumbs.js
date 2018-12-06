import React from 'react';
import { join } from 'path';
import styled, { css } from 'styled-components';
import { Home } from './Icon';

const last = arr => arr[arr.length - 1];

const Wrapper = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  list-style: none;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.75rem;
  color: rgb(68, 68, 68);
  background-color: rgb(250, 251, 252);
  overflow-x: scroll;
  padding: 0.5rem 0;
`;

const BreadcrumbItem = styled.li`
  position: relative;

  &:not(:last-child)::after {
    content: '>';
    color: rgb(114, 121, 129);
  }
`;

const BreadcrumbButton = styled.button`
  margin: 0;
  border: none;
  padding: 0 0.25rem;
  font-family: 'IBM Plex Sans', sans-serif;
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

function Breadcrumbs({ currentPath, onPathClick }) {
  const fragments = currentPath
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
    );

  return (
    <Wrapper>
      {fragments.map(frag => (
        <BreadcrumbItem key={frag.path}>
          <BreadcrumbButton
            type="button"
            title={frag.path}
            active={frag.path === currentPath}
            onClick={() => onPathClick(frag)}
          >
            {frag.path === '/' ? <Home /> : frag.name}
          </BreadcrumbButton>
        </BreadcrumbItem>
      ))}
    </Wrapper>
  );
}

export { Breadcrumbs };
