import { useEffect } from 'react';

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

export { useInterval, useWindowEvent };
