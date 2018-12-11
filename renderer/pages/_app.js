import React, { Fragment } from 'react';
import NextApp, { Container } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../components/GlobalStyle';
import { Provider as DropboxProvider } from '../context/Dropbox';
import { DraggableArea } from '../components/DraggableArea';

class App extends NextApp {
  componentDidMount() {
    const ipc = require('electron-better-ipc');
    ipc.callMain(`main-window-ready`);
  }

  render() {
    const { Component, pageProps, router } = this.props;
    const { dropboxApiKey, initialPath } = router.query;

    return (
      <Container>
        <ThemeProvider theme={{}}>
          <DropboxProvider apiKey={dropboxApiKey}>
            <Fragment>
              <GlobalStyle />
              <DraggableArea />
              <Component {...pageProps} initialPath={initialPath} />
            </Fragment>
          </DropboxProvider>
        </ThemeProvider>
      </Container>
    );
  }
}

export default App;
