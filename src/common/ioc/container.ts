import { Container } from 'inversify';
import {
  DirectoryManager,
  IDirectoryManager,
  IKeysManager,
  ILogManager,
  ISettingsManager,
  ITerminalManager,
  IThemesManager,
  KeysManager,
  LogManager,
  SettingsManager,
  TerminalManager,
  ThemesManager,
  ExplorerManager,
  IExplorerManager,
} from '@fm/common';
import { TYPES } from './types';
import { IPanelsManager, PanelsManager } from 'common/managers';

const container = new Container({ defaultScope: 'Singleton' });

container.bind<IDirectoryManager>(TYPES.IDirectoryManager).to(DirectoryManager).inTransientScope();
container.bind<ILogManager>(TYPES.ILogManager).to(LogManager);
container.bind<ISettingsManager>(TYPES.ISettingsManager).to(SettingsManager);
container.bind<IKeysManager>(TYPES.IKeysManager).to(KeysManager);
container.bind<IThemesManager>(TYPES.IThemesManager).to(ThemesManager);
container.bind<ITerminalManager>(TYPES.ITerminalManager).to(TerminalManager).inTransientScope();
container.bind<IPanelsManager>(TYPES.IPanelsManager).to(PanelsManager);
container.bind<IExplorerManager>(TYPES.IExplorerManager).to(ExplorerManager).inTransientScope();

export { container };
