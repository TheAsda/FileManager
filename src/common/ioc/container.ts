import { Container } from 'inversify';
import { TYPES } from '@fm/common';
import {
  DirectoryManager,
  IDirectoryManager,
  ILogManager,
  LogManager,
} from '@fm/common';

const container = new Container({ defaultScope: 'Singleton' });

container
  .bind<IDirectoryManager>(TYPES.IDirectoryManager)
  .to(DirectoryManager)
  .inTransientScope();
container.bind<ILogManager>(TYPES.ILogManger).to(LogManager);

export { container };
