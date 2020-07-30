import { useMemo } from 'react';
import { ICacheManager } from '@fm/common';
import { TYPES, container } from '../../common/ioc';

const cacheManager = container.get<ICacheManager>(TYPES.ICacheManager);

const useCache = () => {
  const manager = useMemo(() => {
    return cacheManager;
  }, []);

  return manager;
};

export { useCache };
