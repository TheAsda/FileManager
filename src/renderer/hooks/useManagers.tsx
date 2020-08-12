import { DirectoryManager, KeysManager, IdentityManager } from '@fm/common';
import { useMemo } from 'react';

const useManagers = () => {
  const directoryManager = useMemo(
    // () => container.get<IDirectoryManager>(TYPES.IDirectoryManager),
    () => new DirectoryManager(),
    []
  );
  const keysManager = useMemo(
    // () => container.get<IKeysManager>(TYPES.IKeysManager)
    () => new KeysManager(),
    []
  );

  return {
    keysManager,
    directoryManager,
    // getIdentityManager: () => container.get<IIdentityManager>(TYPES.IIdentityManager),
    getIdentityManager: () => new IdentityManager(),
  };
};

export { useManagers };
