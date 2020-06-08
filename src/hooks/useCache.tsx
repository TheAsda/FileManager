import React, { useContext, createContext, useState } from 'react';
import { FileInfo } from '@fm/common';
import { constant, noop } from 'lodash';

interface Cache {
  [path: string]: FileInfo[];
}

const CacheContext = createContext<{
  storage: Cache;
  updateStorage: (path: string, data: FileInfo[]) => void;
  getCached: (path: string) => FileInfo[] | null;
}>({ storage: {}, getCached: constant(null), updateStorage: noop });

const useCache = () => useContext(CacheContext);

const CacheProvider = ({ children }: { children: JSX.Element }) => {
  const [cache, setCache] = useState<Cache>({});

  const updateStorage = (path: string, data: FileInfo[]) => {
    if (cache[path] === undefined) {
      setCache({ ...cache, [path]: data });
    }
  };

  const getCached = (path: string): FileInfo[] | null => {
    if (cache[path]) {
      return cache[path];
    }

    return null;
  };

  return <CacheContext.Provider value={{ storage: cache, updateStorage, getCached }}>{children}</CacheContext.Provider>;
};

export { useCache, CacheProvider, Cache };
