import { useEffect, useRef } from 'react';
import log from 'electron-log';

const useInterval = (fn, ms, when) => {
  useEffect(() => {
    const intervalId = setInterval(fn, ms);
    return () => clearInterval(intervalId);
  }, when);
};

const useWindowEvent = (event, fn, when) => {
  useEffect(() => {
    window.addEventListener(event, fn);
    return () => window.removeEventListener(event, fn);
  }, when);
};

const useWindowKeypress = (keyCode, fn, when) => {
  useWindowEvent('keypress', e => e.keyCode === keyCode && fn(), when);
};

const useLog = (level, mountMessage, unmountMessage, when) => {
  useEffect(() => {
    if (mountMessage) {
      log[level](mountMessage);
    }

    if (unmountMessage) {
      return () => {
        log[level](unmountMessage);
      };
    }
  }, when);
};

const useIsMounted = () => {
  const ref = useRef(true);
  useEffect(
    () => () => {
      ref.current = false;
    },
    [],
  );

  return () => ref.current;
};

export { useInterval, useWindowEvent, useWindowKeypress, useLog, useIsMounted };
