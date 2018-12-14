import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Zap } from './Icon';

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
  color: ${p => p.theme.color.darkGrey};
`;

const IconWrapper = styled.div`
  margin-bottom: 0.5rem;
`;

const MessageWrapper = styled.p`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    sans-serif;
  font-size: 0.75rem;
  width: auto;
  max-width: 150px;
  text-align: center;
`;

function Loading({ threshold, message }) {
  const [showLoader, setShowLoader] = useState(() => threshold < 1);

  useEffect(() => {
    if (threshold > 0) {
      const timeoutId = setTimeout(() => setShowLoader(true), threshold);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return showLoader ? (
    <LoadingWrapper>
      <IconWrapper>
        <Zap />
      </IconWrapper>
      <MessageWrapper>{message}</MessageWrapper>
    </LoadingWrapper>
  ) : null;
}

Loading.defaultProps = {
  threshold: 0,
  message: 'Loading',
};

export { Loading };
