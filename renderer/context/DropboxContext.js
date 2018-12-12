import React, {
  createContext,
  useState,
  useReducer,
  useEffect,
  useMemo,
} from 'react';
import { CancelToken, isCancel } from 'axios';
import * as Dropbox from '../api/Dropbox';
import { callMain } from '../utils/ipc';
import { useIsMounted } from '../hooks';

const DropboxContext = createContext();

function DropboxProvider({ children }) {
  const isMounted = useIsMounted();
  const [fetchState, setFetchState] = useState(1);
  const [state, setState] = useReducer(
    (previousState, state) => ({ ...previousState, ...state }),
    {
      accessToken: null,
      currentPath: null,
      folderContent: [],
      error: null,
    },
  );

  const startFetch = () => isMounted && setFetchState(fetchState + 1);
  const stopFetch = () => isMounted && setFetchState(fetchState - 1);

  const safeSetState = nextState => isMounted && setState(nextState);

  // Fetch the initial state needed to run parts of the application
  useEffect(() => {
    Promise.all([
      callMain('get-access-token'),
      callMain('get-initial-path'),
    ]).then(([{ accessToken }, { initialPath }]) => {
      safeSetState({ accessToken, currentPath: initialPath });
      stopFetch();
    });
  }, []);

  const fetchCurrentPath = async ({ ignoreCache, cancelToken }) => {
    startFetch();
    try {
      const { items } = await Dropbox.listFolder(state.currentPath, {
        accessToken: state.accessToken,
        cancelToken,
        ignoreCache,
      });

      safeSetState({ folderContent: items });
    } catch (error) {
      if (!isCancel(error)) safeSetState({ error });
    } finally {
      stopFetch();
    }
  };

  // Fetch new folder content every time state.currentPath changes
  useEffect(
    () => {
      if (state.currentPath && state.accessToken) {
        const controller = CancelToken.source();
        fetchCurrentPath({ cancelToken: controller.token });
        return () => controller.cancel('Path updated or component unmounted');
      }
    },
    [state.accessToken, state.currentPath],
  );

  const refreshFolder = () => fetchCurrentPath({ ignoreCache: true });

  const providerValue = useMemo(
    () => ({
      state,
      isFetching: fetchState < 1,
      isSignedIn: typeof state.accessToken === 'string',
      goToFolder: path => safeSetState({ currentPath: path }),
      refreshFolder,
    }),
    [state, fetchState],
  );

  return (
    <DropboxContext.Provider value={providerValue}>
      {children}
    </DropboxContext.Provider>
  );
}

export { DropboxContext, DropboxProvider };
