import React, { useState } from 'react';
import styled from 'styled-components';
import { Header } from '../components/Header';

const Wrapper = styled.div``;

function SignIn() {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');

  return (
    <Wrapper>
      <div style={{ zIndex: 1 }}>
        <Header />
      </div>

      <div hidden={showCodeInput}>
        <h2>Sign in with Dropbox</h2>
        <p>
          Click the button below and authorize this application – get the code
          provided by Dropbox and return here
        </p>
        <button onClick={() => setShowCodeInput(!showCodeInput)}>
          Authorize Bryggan
        </button>
      </div>

      <div hidden={!showCodeInput}>
        <form onSubmit={e => e.preventDefault()}>
          <h2>Paste your code to sign in</h2>
          <label htmlFor="input-code">
            <span>Code:</span>
            <input
              type="text"
              id="input-code"
              name="input-code"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </label>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </Wrapper>
  );
}

export default SignIn;
