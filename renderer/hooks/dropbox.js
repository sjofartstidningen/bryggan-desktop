import * as Dropbox from '../api/Dropbox';
import axios, { CancelToken } from 'axios';
import { useState, useEffect } from 'react';

function useListFolder({ initialPath = '/', apiKey } = {}) {
  const [currentPath, setPath] = useState(initialPath);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [state, setState] = useState('initial');

  const goToPath = nextPath => setPath(nextPath);

  useEffect(
    () => {
      if (apiKey) {
        setState('fetching');

        const controller = CancelToken.source();

        Dropbox.listFolder(currentPath, {
          apiKey,
          cancelToken: controller.token,
        })
          .then(({ items }) => {
            setItems(items);
            setError(null);
            setState('success');
          })
          .catch(error => {
            if (axios.isCancel(error)) return;
            setError(error);
            setState('error');
          });

        return () => controller.cancel();
      }
    },
    [currentPath, apiKey],
  );

  return {
    state,
    currentPath,
    items,
    error,
    goToPath,
  };
}

export { useListFolder };
