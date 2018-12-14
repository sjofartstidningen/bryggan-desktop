import { CancelToken, isCancel } from 'axios';
import { useReducer, useEffect } from 'react';
import * as Dropbox from '../../shared/api/Dropbox';
import { useIsMounted } from './';

const ListFolderStage = {
  initial: 'INITIAL',
  fetching: 'FETCHING',
  success: 'SUCCESS',
  error: 'ERROR',
};

function useListFolder({ accessToken, initialPath }) {
  const isMounted = useIsMounted();
  const [state, setState] = useReducer(
    (prevState, nextState) => ({ ...prevState, ...nextState }),
    {
      stage: ListFolderStage.initial,
      currentPath: initialPath,
      folderContent: [],
      error: null,
    },
  );

  const safeSetState = nextState => isMounted() && setState(nextState);

  const fetchCurrentPath = async ({ ignoreCache, cancelToken }) => {
    try {
      const { items } = await Dropbox.listFolder(state.currentPath, {
        accessToken,
        cancelToken,
        ignoreCache,
      });

      safeSetState({
        stage: ListFolderStage.success,
        folderContent: items,
        error: null,
      });
    } catch (error) {
      if (!isCancel(error)) {
        safeSetState({ stage: ListFolderStage.error, error });
      } else {
        safeSetState({ stage: ListFolderStage.success, error: null });
      }
    }
  };

  useEffect(
    () => {
      safeSetState({ stage: ListFolderStage.fetching });
      const controller = CancelToken.source();
      fetchCurrentPath({ cancelToken: controller.token, ignoreCache: false });
      return () => controller.cancel();
    },
    [state.currentPath],
  );

  return {
    ...state,
    setPath: newPath => safeSetState({ currentPath: newPath }),
    refreshCurrentPath: () => fetchCurrentPath({ ignoreCache: true }),
  };
}

export { useListFolder, ListFolderStage };
