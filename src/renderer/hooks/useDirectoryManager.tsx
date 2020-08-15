import { DirectoryManager } from '@fm/common';
import { useMemo } from 'react';

const useDirectoryManager = () => {
  const directoryManager = useMemo(() => new DirectoryManager(), []);

  return {
    directoryManager,
  };
};

export { useDirectoryManager };
