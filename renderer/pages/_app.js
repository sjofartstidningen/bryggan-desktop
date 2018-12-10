import React, { Fragment } from 'react';
import NextApp, { Container } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../components/GlobalStyle';
import { Provider as DropboxProvider } from '../context/Dropbox';

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, dropboxApiKey: process.env.DROPBOX_API_KEY };
  }

  render() {
    const { Component, pageProps, dropboxApiKey } = this.props;
    return (
      <Container>
        <ThemeProvider theme={{}}>
          <DropboxProvider apiKey={dropboxApiKey}>
            <Fragment>
              <GlobalStyle />
              <Component {...pageProps} />
            </Fragment>
          </DropboxProvider>
        </ThemeProvider>
      </Container>
    );
  }
}

export default App;
