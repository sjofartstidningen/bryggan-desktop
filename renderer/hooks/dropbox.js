import { useState, useEffect, useContext } from 'react';
import axios, { CancelToken } from 'axios';
import { DropboxContext } from '../context/Dropbox';

function useListFolder(initialPath = null) {
  const dropbox = useContext(DropboxContext);
  const [currentPath, setPath] = useState(initialPath);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [state, setState] = useState('initial');

  const listFolder = async ({ ignoreCache = false, cancelToken }) => {
    try {
      const { items } = await dropbox.listFolder(currentPath, {
        cancelToken,
        ignoreCache,
      });

      setItems(items);
      setError(null);
      setState('success');
    } catch (error) {
      if (!axios.isCancel(error)) {
        setError(error);
        setState('error');
      }
    }
  };

  useEffect(
    () => {
      if (currentPath && dropbox.accessToken) {
        setState('fetching');
        const controller = CancelToken.source();
        listFolder({ ignoreCache: false, cancelToken: controller.token });
        return () => controller.cancel('Path updated or component unmounted');
      }
    },
    [currentPath, dropbox],
  );

  const goToPath = nextPath => setPath(nextPath);
  const update = () => listFolder({ ignoreCache: true });

  return {
    state,
    currentPath,
    items,
    error,
    goToPath,
    update,
    setState,
  };
}

export { useListFolder };
