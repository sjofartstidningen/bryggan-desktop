import React, { Fragment, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import mitt from 'mitt';

const StickyWrapper = styled.div`
  position: sticky;
  top: 0;
`;

const Sentinel = styled.div`
  position: absolute;
  top: calc(var(--electron-safe-inset) / -2);
  height: 0;
  width: 0;
`;

const emitter = mitt();

const createObserver = () => {
  const observer = new IntersectionObserver(
    (records, observer) => {
      for (const record of records) {
        if (record.intersectionRatio === 0) emitter.emit('stick');
        if (record.intersectionRatio === 1) emitter.emit('un-stick');
      }
    },
    { threshold: [0] },
  );

  return observer;
};

function Sticky({ as, children, ...props }) {
  const sentinel = useRef(null);
  const [sticky, setSticky] = useState(false);

  useEffect(
    () => {
      const observer = createObserver();
      observer.observe(sentinel.current);
      return () => observer.unobserve(sentinel.current);
    },
    [sentinel],
  );

  useEffect(() => {
    const stick = () => setSticky(true);
    const unStick = () => setSticky(false);
    emitter.on('stick', stick);
    emitter.on('un-stick', unStick);

    return () => {
      emitter.off('stick', stick);
      emitter.off('un-stick', unStick);
    };
  }, []);

  return (
    <Fragment>
      <StickyWrapper {...props} className={sticky && 'sticky'} as={as}>
        <Sentinel ref={sentinel} />
        {children}
      </StickyWrapper>
    </Fragment>
  );
}

export { Sticky };
