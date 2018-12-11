import React, { Fragment, useState } from 'react';
import styled, { css } from 'styled-components';
import { ContextMenuIcon } from './Icon';
import { hideVisually } from 'polished';

const ContextMenuWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0rem;
  z-index: ${({ zIndex }) => zIndex || 0};
`;

const ContextMenuBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ zIndex }) => zIndex};
  width: 100vw;
  height: 100vh;
  opacity: 0;
`;

const MenuToggleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--electron-safe-inset, 1rem);
  height: var(--electron-safe-inset, 1rem);
  margin: 0;
  border: none;
  border-radius: 100%;
  padding: 0;
  font-size: 1rem;
  color: rgb(153, 153, 153);
  background-color: transparent;

  &:focus,
  &:hover {
    color: rgb(0, 0, 0);
    outline: none;
  }
`;

const VisuallyHidden = styled.span`
  ${hideVisually()};
`;

const ChildMenuWrapper = styled.div`
  position: absolute;
  right: 0.5rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  border: 1px solid rgba(153, 153, 153, 0.2);
  border-radius: 4px;
  padding: 0.5rem;
  background-color: rgb(255, 255, 255);

  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition: all 0.3s ease-in-out;

  ${({ hidden }) =>
    hidden &&
    css`
      opacity: 0;
      visibility: hidden;
      transform: translateX(100%);
    `}
`;

function ContextMenu({ children, zIndex }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Fragment>
      <ContextMenuWrapper zIndex={zIndex}>
        <MenuToggleButton type="button" onClick={() => setShowMenu(!showMenu)}>
          <ContextMenuIcon baseline={false} />
          <VisuallyHidden>Show menu</VisuallyHidden>
        </MenuToggleButton>
        <ChildMenuWrapper hidden={!showMenu}>{children}</ChildMenuWrapper>
      </ContextMenuWrapper>
      {showMenu && (
        <ContextMenuBackdrop
          zIndex={zIndex - 1}
          onClick={() => setShowMenu(false)}
        />
      )}
    </Fragment>
  );
}

const ContextMenuItem = styled.div`
  margin-bottom: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    sans-serif;
  font-size: 0.75rem;
  white-space: nowrap;

  &:last-child {
    margin-bottom: 0;
  }
`;

export { ContextMenu, ContextMenuItem };
