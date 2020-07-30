import { injectable, inject } from 'inversify';
import { Theme, DEFAULT_THEME } from '@fm/common';
import { IThemesManager } from './IThemesManager';
import { ISettingsManager } from '../SettingsManager/ISettingsManager';
import { ILogManager } from '../LogManager/ILogManager';
import { merge, isEmpty } from 'lodash';
import { TYPES } from '../../ioc';
import Store from 'electron-store';

@injectable()
class ThemesManager implements IThemesManager {
  private store: Store<Theme>;
  private settingsManager: ISettingsManager;
  private logger: ILogManager;

  constructor(
    @inject(TYPES.ILogManager) logger: ILogManager,
    @inject(TYPES.ISettingsManager) settingsManager: ISettingsManager
  ) {
    this.settingsManager = settingsManager;
    this.logger = logger;
    this.store = new Store<Theme>({
      name: settingsManager.getSettings().theme,
    });
  }

  /** @inheritdoc */
  getTheme(): Theme {
    this.logger.log('Getting theme');

    let theme = this.store.store;

    if (isEmpty(theme)) {
      this.store.set(DEFAULT_THEME);
      theme = DEFAULT_THEME;
    } else {
      theme = merge(DEFAULT_THEME, theme);
    }

    if (!theme['explorer-background-color']) {
      theme['explorer-background-color'] = theme['primary-background-color'];
    }
    if (!theme['explorer-text-color']) {
      theme['explorer-text-color'] = theme['primary-text-color'];
    }
    if (!theme['explorer-font-family']) {
      theme['explorer-font-family'] = theme['preview-font-family'];
    }
    if (!theme['explorer-font-size']) {
      theme['explorer-font-size'] = theme['primary-font-size'];
    }

    if (!theme['preview-background-color']) {
      theme['preview-background-color'] = theme['primary-background-color'];
    }
    if (!theme['preview-font-family']) {
      theme['preview-font-family'] = theme['primary-font-family'];
    }
    if (!theme['preview-font-size']) {
      theme['preview-font-size'] = theme['primary-font-size'];
    }
    if (!theme['preview-text-color']) {
      theme['preview-text-color'] = theme['primary-text-color'];
    }

    return theme;
  }
}

export { ThemesManager };
