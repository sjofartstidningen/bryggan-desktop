import styled from 'styled-components';

const DraggableArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: var(--electron-safe-inset, 0px);
  z-index: 5;
  pointer-events: none;
  app-region: drag;
`;

export { DraggableArea };
