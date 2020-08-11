import { IThemesManager, IKeysManager, IDirectoryManager, IIdentityManager } from '@fm/common';
import { container } from '../../common/ioc/container';
import { TYPES } from '../../common/ioc/types';
import { useMemo } from 'react';

const useManagers = () => {
  const directoryManager = useMemo(
    () => container.get<IDirectoryManager>(TYPES.IDirectoryManager),
    []
  );
  const keysManager = useMemo(() => container.get<IKeysManager>(TYPES.IKeysManager), []);
  const themesManager = useMemo(() => container.get<IThemesManager>(TYPES.IThemesManager), []);

  return {
    keysManager,
    themesManager,
    directoryManager,
    getIdentityManager: () => container.get<IIdentityManager>(TYPES.IIdentityManager),
  };
};

export { useManagers };
