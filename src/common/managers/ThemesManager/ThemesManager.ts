import { injectable, inject } from 'inversify';
import { Theme, DEFAULT_THEME } from '@fm/common';
import { IThemesManager } from './IThemesManager';
import { ISettingsManager } from '../SettingsManager/ISettingsManager';
import { ConfigManager } from '../ConfigManager/ConfigManager';
import { ILogManager } from '../LogManager/ILogManager';
import { IDirectoryManager } from '../DirectoryManager/IDirectoryManager';
import { merge } from 'lodash';
import { TYPES } from '../../ioc';

@injectable()
class ThemesManager extends ConfigManager implements IThemesManager {
  private Theme?: Theme;

  private SettingsManager: ISettingsManager;

  constructor(
    @inject(TYPES.ILogManager) logger: ILogManager,
    @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager,
    @inject(TYPES.ISettingsManager) settingsManager: ISettingsManager
  ) {
    super(settingsManager.getSettings().theme, logger, directoryManager);

    this.SettingsManager = settingsManager;
  }

  /** @inheritdoc */
  getTheme(): Theme {
    if (!this.Theme) {
      this.Theme = this.retrieve();
    }

    if (!this.Theme['explorer-background-color']) {
      this.Theme['explorer-background-color'] = this.Theme['primary-background-color'];
    }
    if (!this.Theme['explorer-text-color']) {
      this.Theme['explorer-text-color'] = this.Theme['primary-text-color'];
    }
    if (!this.Theme['explorer-font-family']) {
      this.Theme['explorer-font-family'] = this.Theme['preview-font-family'];
    }
    if (!this.Theme['explorer-font-size']) {
      this.Theme['explorer-font-size'] = this.Theme['primary-font-size'];
    }

    if (!this.Theme['preview-background-color']) {
      this.Theme['preview-background-color'] = this.Theme['primary-background-color'];
    }
    if (!this.Theme['preview-font-family']) {
      this.Theme['preview-font-family'] = this.Theme['primary-font-family'];
    }
    if (!this.Theme['preview-font-size']) {
      this.Theme['preview-font-size'] = this.Theme['primary-font-size'];
    }
    if (!this.Theme['preview-text-color']) {
      this.Theme['preview-text-color'] = this.Theme['primary-text-color'];
    }

    return this.Theme;
  }

  private retrieve(): Theme {
    const userTheme = this.getConfig<Theme>();

    if (!userTheme) {
      return DEFAULT_THEME;
    }

    return merge(DEFAULT_THEME, userTheme);
  }
}

export { ThemesManager };
