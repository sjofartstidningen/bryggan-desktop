import React, { Fragment } from 'react';
import NextApp, { Container } from 'next/app';
import { ThemeProvider } from 'styled-components';
import log from 'electron-log';
import { is } from 'electron-util';
import { GlobalStyle } from '../components/GlobalStyle';
import { Provider as DropboxProvider } from '../context/Dropbox';
import { DraggableArea } from '../components/DraggableArea';
import { callMain } from '../utils/ipc';
import * as theme from '../style/theme';
import { setupExceptionHandler } from '../../shared/exception-handler';

if (is.renderer) setupExceptionHandler();

class App extends NextApp {
  componentDidMount() {
    callMain(`main-window-ready`).then(() => {
      log.info('Main window ready in renderer process');
    });
  }

  render() {
    const { Component, pageProps, router } = this.props;
    const { accessToken } = router.query;

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <DropboxProvider accessToken={accessToken}>
            <Fragment>
              <GlobalStyle />
              <DraggableArea />
              <Component {...pageProps} {...router.query} />
            </Fragment>
          </DropboxProvider>
        </ThemeProvider>
      </Container>
    );
  }
}

export default App;
