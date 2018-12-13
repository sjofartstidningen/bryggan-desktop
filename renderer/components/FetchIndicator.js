import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;
  height: 2px;
  background-color: white;
`;

const Indicator = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${p => p.theme.color.black};
  transform-origin: top left;
  transition: transform 0.2s ease-in-out;
  will-change: transform;
`;

function FetchIndicator({ isFetching }) {
  const [progress, setProgress] = useState(0);

  useEffect(
    () => {
      if (isFetching) {
        let timeoutId;
        const intervalId = setInterval(() => {
          const nextProgress = progress + 0.01;
          if (nextProgress > 0.95) {
            clearInterval(intervalId);
          } else {
            setProgress(1);
            timeoutId = setTimeout(() => setProgress(0), 200);
          }
        }, 200);

        return () => {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
        };
      } else {
        setProgress(0);
      }
    },
    [isFetching],
  );

  return (
    <Wrapper>
      <Indicator style={{ transform: `scaleX(${progress})` }} />
    </Wrapper>
  );
}

export { FetchIndicator };
