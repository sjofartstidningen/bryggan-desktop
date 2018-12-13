import React, { Fragment } from 'react';
import NextApp, { Container } from 'next/app';
import { ThemeProvider } from 'styled-components';
import log from 'electron-log';
import { GlobalStyle } from '../components/GlobalStyle';
import { DropboxProvider } from '../context/DropboxContext';
import { DraggableArea } from '../components/DraggableArea';
import { callMain } from '../utils/ipc';
import * as theme from '../style/theme';

class App extends NextApp {
  componentDidMount() {
    callMain('main-window-ready').then(() => {
      log.info('Main window ready in renderer process');
    });
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <DropboxProvider>
            <Fragment>
              <GlobalStyle />
              <DraggableArea />
              <Component {...pageProps} />
            </Fragment>
          </DropboxProvider>
        </ThemeProvider>
      </Container>
    );
  }
}

export default App;
