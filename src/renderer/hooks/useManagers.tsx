import { DirectoryManager, IdentityManager } from '@fm/common';
import { useMemo } from 'react';

const useManagers = () => {
  const directoryManager = useMemo(() => new DirectoryManager(), []);

  return {
    directoryManager,
    getIdentityManager: () => new IdentityManager(),
  };
};

export { useManagers };
