import { Container } from 'inversify';
import {
  DirectoryManager,
  IDirectoryManager,
  IKeysManager,
  ILogManager,
  ITerminalManager,
  KeysManager,
  LogManager,
  TerminalManager,
  ExplorerManager,
  IExplorerManager,
  IIdentityManager,
  IdentityManager,
} from '@fm/common';
import { TYPES } from './types';

const container = new Container({ defaultScope: 'Singleton' });

container.bind<IDirectoryManager>(TYPES.IDirectoryManager).to(DirectoryManager).inTransientScope();
container.bind<ILogManager>(TYPES.ILogManager).to(LogManager);
container.bind<IKeysManager>(TYPES.IKeysManager).to(KeysManager);
container.bind<ITerminalManager>(TYPES.ITerminalManager).to(TerminalManager).inTransientScope();
container.bind<IExplorerManager>(TYPES.IExplorerManager).to(ExplorerManager).inTransientScope();
container.bind<IIdentityManager>(TYPES.IIdentityManager).to(IdentityManager).inTransientScope();

export { container };
