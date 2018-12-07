import React from 'react';
import styled from 'styled-components';
import { Logotype } from './Logotype';
import { hideVisually } from 'polished';

const Container = styled.header`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin-top: calc(var(--electron-safe-inset, 0px) * -1);
  padding: calc(var(--electron-safe-inset, 1rem) / 2) 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    sans-serif;
  font-size: 0.75rem;
  user-select: none;
  app-region: drag;
`;

const Title = styled.h1`
  ${hideVisually()}
`;

const LogotypeWrapper = styled.div`
  width: 15%;
`;

function Header() {
  return (
    <Container>
      <Title>Bryggan</Title>
      <LogotypeWrapper>
        <Logotype />
      </LogotypeWrapper>
    </Container>
  );
}

export { Header };
