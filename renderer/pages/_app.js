import React, { Fragment } from 'react';
import NextApp, { Container } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../components/GlobalStyle';
import { GoogleFonts } from '../components/GoogleFonts';

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const fonts = [{ name: 'IBM Plex Sans', weights: [400, 600] }];

    return { pageProps, fonts };
  }

  render() {
    const { Component, pageProps, fonts } = this.props;
    return (
      <Container>
        <ThemeProvider theme={{}}>
          <Fragment>
            <Head>
              <GoogleFonts fonts={fonts} />
            </Head>
            <GlobalStyle />
            <Component {...pageProps} />
          </Fragment>
        </ThemeProvider>
      </Container>
    );
  }
}

export default App;
