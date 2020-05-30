import { Container } from 'inversify';
import { TYPES } from '@fm/common';
import {
  DirectoryManager,
  IDirectoryManager,
  ILogManager,
  LogManager,
  ISettingsManager,
  SettingsManager,
  IKeysManager,
} from '@fm/common';
import { KeysManager } from 'common/managers';

const container = new Container({ defaultScope: 'Singleton' });

container
  .bind<IDirectoryManager>(TYPES.IDirectoryManager)
  .to(DirectoryManager)
  .inTransientScope();
container.bind<ILogManager>(TYPES.ILogManger).to(LogManager);
container.bind<ISettingsManager>(TYPES.ISettingsManager).to(SettingsManager);
container.bind<IKeysManager>(TYPES.IKeysManager).to(KeysManager);

export { container };
