import React, { StrictMode } from 'react';
import NextApp, { Container } from 'next/app';

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    let initialProps = {};

    if (Component.getInitialProps) {
      initialProps = await Component.getInitialProps(ctx);
    }

    return { initialProps };
  }

  render() {
    const { Component, initialProps } = this.props;
    return (
      <StrictMode>
        <Container>
          <Component {...initialProps} />
        </Container>
      </StrictMode>
    );
  }
}

export default App;
