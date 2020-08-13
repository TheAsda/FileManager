import { DirectoryManager, IdentityManager } from '@fm/common';
import { useMemo } from 'react';

const useManagers = () => {
  const directoryManager = useMemo(
    // () => container.get<IDirectoryManager>(TYPES.IDirectoryManager),
    () => new DirectoryManager(),
    []
  );

  return {
    directoryManager,
    // getIdentityManager: () => container.get<IIdentityManager>(TYPES.IIdentityManager),
    getIdentityManager: () => new IdentityManager(),
  };
};

export { useManagers };
