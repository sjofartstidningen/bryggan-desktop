import React, { Fragment } from 'react';
import NextApp, { Container } from 'next/app';
import Router from 'next/router';
import { ThemeProvider } from 'styled-components';
import log from 'electron-log';
import { GlobalStyle } from '../components/GlobalStyle';
import { DraggableArea } from '../components/DraggableArea';
import { Header } from '../components/Header';
import { callMain, answerMain } from '../utils/ipc';
import * as theme from '../style/theme';

class App extends NextApp {
  unsub = null;
  componentDidMount() {
    this.unsub = answerMain('open-file', () => {
      log.info('Transition to /open-file');
      Router.push('/open-file');
    });

    callMain('main-window-ready').then(() => {
      log.info('Main window ready in renderer process');
    });
  }

  componentWillUnmount() {
    if (this.unsub) this.unsub();
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <Fragment>
            <GlobalStyle />
            <DraggableArea />
            <Header />
            <Component {...pageProps} />
          </Fragment>
        </ThemeProvider>
      </Container>
    );
  }
}

export default App;
