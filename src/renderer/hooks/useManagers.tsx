import {
  ISettingsManager,
  IThemesManager,
  IKeysManager,
  IDirectoryManager,
  IIdentityManager,
} from '@fm/common';
import { container, TYPES } from '../../common/ioc';

const settingsManager = container.get<ISettingsManager>(TYPES.ISettingsManager);
const keysManager = container.get<IKeysManager>(TYPES.IKeysManager);
const themesManager = container.get<IThemesManager>(TYPES.IThemesManager);
const directoryManager = container.get<IDirectoryManager>(TYPES.IDirectoryManager);

const useManagers = () => ({
  keysManager,
  settingsManager,
  themesManager,
  directoryManager,
  getIdentityManager: () => container.get<IIdentityManager>(TYPES.IIdentityManager),
});

export { useManagers };
