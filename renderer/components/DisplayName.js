import PQueue from 'p-queue';
import { getAccount } from '../../shared/api/Dropbox';
import { useMainStore, usePromise } from '../hooks';

/**
 * This queue is there to prevent fireing of simultaneous calls for the same
 * account id – instead this will queue all calls and run them one by one and
 * therefore the cached response will be available for subsequent calls.
 */
const queue = new PQueue({ concurrency: 1 });

function DisplayName({ accountId }) {
  const { settled, response } = useMainStore(['accessToken']);
  const [, displayName] = usePromise(
    async () => {
      if (!response || (response && !response.accessToken)) return '';
      try {
        const { account } = await queue.add(() =>
          getAccount(accountId, {
            accessToken: response.accessToken,
          }),
        );

        return account ? account.displayName : '';
      } catch (error) {
        return '';
      }
    },
    [settled],
  );

  return displayName;
}

export { DisplayName };
