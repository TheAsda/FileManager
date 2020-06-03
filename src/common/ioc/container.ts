import { Container } from 'inversify';
import {
  DirectoryManager,
  IDirectoryManager,
  ILogManager,
  LogManager,
  ISettingsManager,
  SettingsManager,
  IKeysManager,
  KeysManager,
  IThemesManager,
  ThemesManager,
  TerminalManager,
  ITerminalManager,
} from '@fm/common';
import { TYPES } from './types';

const container = new Container({ defaultScope: 'Singleton' });

container
  .bind<IDirectoryManager>(TYPES.IDirectoryManager)
  .to(DirectoryManager)
  .inTransientScope();
container.bind<ILogManager>(TYPES.ILogManager).to(LogManager);
container.bind<ISettingsManager>(TYPES.ISettingsManager).to(SettingsManager);
container.bind<IKeysManager>(TYPES.IKeysManager).to(KeysManager);
container.bind<IThemesManager>(TYPES.IThemesManager).to(ThemesManager);
container.bind<ITerminalManager>(TYPES.ITerminalManager).to(TerminalManager);

export { container };
