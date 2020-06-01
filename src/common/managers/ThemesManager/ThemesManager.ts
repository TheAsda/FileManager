import { injectable, inject } from 'inversify';
import { Theme, DEFAULT_THEME } from '@fm/common';
import { IThemesManager } from './IThemesManager';
import { ISettingsManager } from '../SettingsManager/ISettingsManager';
import { ConfigManager } from '../ConfigManager/ConfigManager';
import { TYPES } from 'common/ioc';
import { ILogManager } from '../LogManager/ILogManager';
import { IDirectoryManager } from '../DirectoryManager/IDirectoryManager';
import { merge } from 'lodash';

@injectable()
class ThemesManager extends ConfigManager implements IThemesManager {
  private Theme?: Theme;

  private SettingsManager: ISettingsManager;

  constructor(
    @inject(TYPES.ILogManager) logger: ILogManager,
    @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager,
    @inject(TYPES.ISettingsManager) settingsManager: ISettingsManager
  ) {
    super(logger, directoryManager);

    this.SettingsManager = settingsManager;
  }

  /** @inheritdoc */
  getTheme(): Theme {
    if (!this.Theme) {
      this.Theme = this.retrieve(this.SettingsManager.getSettings().theme);
    }

    return this.Theme;
  }

  private retrieve(themeName: string): Theme {
    const userTheme = this.parseFile<Theme>(`/themes/${themeName}.json`);

    return userTheme ? merge(DEFAULT_THEME, userTheme) : DEFAULT_THEME;
  }
}

export { ThemesManager };
