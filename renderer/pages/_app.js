import React, { Fragment } from 'react';
import NextApp, { Container } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../components/GlobalStyle';

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <ThemeProvider theme={{}}>
          <Fragment>
            <GlobalStyle />
            <Component {...pageProps} />
          </Fragment>
        </ThemeProvider>
      </Container>
    );
  }
}

export default App;
