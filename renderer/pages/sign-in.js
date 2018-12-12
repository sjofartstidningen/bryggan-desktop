import { shell } from 'electron';
import React, { useState } from 'react';
import Router from 'next/router';
import styled, { css } from 'styled-components';
import qs from 'qs';
import axios from 'axios';
import { borderRadius } from 'polished';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { callMain } from '../utils/ipc';

const Section = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  font-family: ${p => p.theme.font.family};
  color: ${p => p.theme.color.darkGrey};
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition: all 0.3s ease-in-out;
  will-change: transform, opacity, visibility;

  ${p =>
    p.hidden &&
    css`
      opacity: 0;
      visibility: hidden;
      transform: translateX(100%);

      &:first-child {
        transform: translateX(-100%);
      }
    `}
`;

const SectionTitle = styled.h2`
  max-width: 125px;
  margin-bottom: 0.75rem;
  font-weight: 700;
  font-size: ${p => p.theme.font.size.large};
  line-height: 1.2;
  text-align: center;
`;

const BodyText = styled.p`
  max-width: 250px;
  margin-bottom: 1.75rem;
  font-size: ${p => p.theme.font.size.normal};
`;

const CtaButton = styled.button`
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-family: ${p => p.theme.font.family};
  font-size: ${p => p.theme.font.size.normal};
  color: white;
  background-color: ${p => p.theme.color.black};
`;

const Label = styled.label`
  display: flex;
  justify-content: flex-start;
  align-content: center;
  width: 100%;
  margin-bottom: 1.75rem;
`;

const LabelText = styled.span`
  margin: 0;
  border: 1px solid ${p => p.theme.color.grey};
  border-right: none;
  ${borderRadius('left', '4px')};
  padding: 0 0.5rem;
  font-size: ${p => p.theme.font.size.normal};
  line-height: 2rem;
`;

const Input = styled.input`
  flex: 1;
  margin: 0;
  border: 1px solid ${p => p.theme.color.grey};
  ${borderRadius('right', '4px')};
  padding: 0 0.5rem;
  font-size: ${p => p.theme.font.size.large};
  font-family: ${p => p.theme.font.family};
  line-height: 2rem;
`;

function SignIn() {
  const [page, setPage] = useState('authorize');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  const onAuthorizeClick = () => {
    const query = qs.stringify({
      response_type: 'code',
      client_id: process.env.DROPBOX_APP_KEY,
      require_role: 'work',
      disable_signup: true,
    });
    shell.openExternal(`https://www.dropbox.com/oauth2/authorize?${query}`);
    setPage('code-input');
  };

  const onSignInClick = async () => {
    try {
      setPage('loading');
      const { data } = await axios({
        method: 'post',
        url: 'https://api.dropboxapi.com/oauth2/token',
        params: {
          code,
          grant_type: 'authorization_code',
          client_id: process.env.DROPBOX_APP_KEY,
          client_secret: process.env.DROPBOX_APP_SECRET,
        },
      });

      await callMain('dropbox-authorized', {
        accessToken: data.access_token,
      });

      Router.push({
        pathname: '/file-picker',
        query: { accessToken: data.access_token, initialPath: '/' },
      });
    } catch (error) {
      setError(
        new Error('Could not authorize. Maybe the code is not properly pasted'),
      );
      setPage('error');
      console.dir(error);
    }
  };

  return (
    <div>
      <div style={{ zIndex: 1 }}>
        <Header />
      </div>

      <main>
        <Section hidden={page !== 'authorize'}>
          <SectionTitle>Sign in with Dropbox</SectionTitle>
          <BodyText>
            Click the button below and authorize this application – get the code
            provided by Dropbox and then return here.
          </BodyText>
          <CtaButton type="button" onClick={onAuthorizeClick}>
            Authorize Bryggan
          </CtaButton>
        </Section>

        <Section hidden={page !== 'code-input'}>
          <SectionTitle>Paste your code to sign in</SectionTitle>
          <Label htmlFor="input-code">
            <LabelText>Code</LabelText>
            <Input
              type="text"
              id="input-code"
              name="input-code"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </Label>
          <CtaButton type="button" onClick={onSignInClick}>
            Sign In
          </CtaButton>
        </Section>

        <Section hidden={page !== 'loading'}>
          <Loading threshold={300} message="Authorizing" />
        </Section>

        <Section hidden={page !== 'error'}>
          <BodyText>{error ? error.message : 'An error occured'}</BodyText>
          <CtaButton type="button" onClick={() => setPage('authorize')}>
            Try again
          </CtaButton>
        </Section>
      </main>
    </div>
  );
}

export default SignIn;
