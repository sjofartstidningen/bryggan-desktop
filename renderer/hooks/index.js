import { useEffect } from 'react';
import { events } from '../../shared/events';

const useReady = pageName => {
  useEffect(() => events.emit(`${pageName}-ready`), []);
};

export { useReady };
