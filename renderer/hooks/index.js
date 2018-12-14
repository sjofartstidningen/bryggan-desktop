import { useState, useEffect, useRef } from 'react';
import log from 'electron-log';
import { callMain } from '../utils/ipc';
import { storeGet } from '../../shared/ipc-channels';

const useInterval = (fn, ms, inputs) => {
  useEffect(() => {
    const intervalId = setInterval(fn, ms);
    return () => clearInterval(intervalId);
  }, inputs);
};

const useWindowEvent = (event, fn, inputs) => {
  useEffect(() => {
    window.addEventListener(event, fn);
    return () => window.removeEventListener(event, fn);
  }, inputs);
};

const useWindowKeypress = (keyCode, fn, inputs) => {
  useWindowEvent('keypress', e => e.keyCode === keyCode && fn(), inputs);
};

const useLog = (level, mountMessage, unmountMessage, inputs) => {
  useEffect(() => {
    if (mountMessage) {
      log[level](mountMessage);
    }

    if (unmountMessage) {
      return () => {
        log[level](unmountMessage);
      };
    }
  }, inputs);
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

const usePromise = (promiseFn, inputs) => {
  const isMounted = useIsMounted();
  const [settled, setSettled] = useState(false);
  const [resolvedValue, setResolvedValue] = useState(null);
  const [rejectedValue, setRejectedValue] = useState(null);

  useEffect(() => {
    promiseFn()
      .then(val => isMounted() && setResolvedValue(val))
      .catch(val => isMounted() && setRejectedValue(val))
      .finally(() => isMounted() && setSettled(true));
  }, inputs);

  return [settled, resolvedValue, rejectedValue];
};

const useCallMain = (channel, payload, inputs) => {
  const [settled, resolvedValue, rejectedValue] = usePromise(
    () => callMain(channel, payload),
    inputs,
  );

  return [settled, resolvedValue, rejectedValue];
};

const useMainStore = (keys = []) => {
  const [settled, response, error] = useCallMain(storeGet, { keys }, []);
  return { settled, response, error };
};

export {
  useInterval,
  useWindowEvent,
  useWindowKeypress,
  useLog,
  useIsMounted,
  usePromise,
  useCallMain,
  useMainStore,
};
