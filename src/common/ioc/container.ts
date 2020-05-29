import { Container } from 'inversify';
import { TYPES } from '@fm/common';
import {
  DirectoryManager,
  IDirectoryManager,
  ILogManager,
  LogManager,
  ISettingsManager,
  SettingsManager,
} from '@fm/common';

const container = new Container({ defaultScope: 'Singleton' });

container
  .bind<IDirectoryManager>(TYPES.IDirectoryManager)
  .to(DirectoryManager)
  .inTransientScope();
container.bind<ILogManager>(TYPES.ILogManger).to(LogManager);
container.bind<ISettingsManager>(TYPES.ISettingsManager).to(SettingsManager);

export { container };
