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
      name: 'themes/' + settingsManager.getSettings().theme,
    });
  }

  /** @inheritdoc */
  getTheme(): Theme {
    this.logger.log('Getting theme');

    let theme = this.store.store;

    if (isEmpty(theme)) {
      this.store.set(this.fillTheme(DEFAULT_THEME));
      theme = DEFAULT_THEME;
    } else {
      theme = merge(DEFAULT_THEME, theme);
    }

    return this.fillTheme(theme);
  }

  changeTheme(theme: string): void {
    this.store = new Store<Theme>({
      name: 'themes/' + theme,
    });
  }

  private fillTheme(theme: Theme): Theme {
    return {
      ...theme,
      'explorer-background-color':
        theme['explorer-background-color'] ?? theme['primary-background-color'],
      'explorer-text-color': theme['explorer-text-color'] ?? theme['primary-text-color'],
      'explorer-font-family': theme['explorer-font-family'] ?? theme['primary-font-family'],
      'explorer-font-size': theme['explorer-font-size'] ?? theme['primary-font-size'],
      'explorer-hover-color': theme['explorer-hover-color'] ?? theme['primary-hover-color'],
      'explorer-selected-color':
        theme['explorer-selected-color'] ?? theme['primary-selected-color'],

      'preview-background-color':
        theme['preview-background-color'] ?? theme['primary-background-color'],
      'preview-font-family': theme['preview-font-family'] ?? theme['primary-font-family'],
      'preview-font-size': theme['preview-font-size'] ?? theme['primary-font-size'],
      'preview-text-color': theme['preview-text-color'] ?? theme['primary-text-color'],

      'palette-background-color':
        theme['palette-background-color'] ?? theme['primary-background-color'],
      'palette-font-family': theme['palette-font-family'] ?? theme['primary-font-family'],
      'palette-font-size': theme['palette-font-size'] ?? theme['primary-font-size'],
      'palette-text-color': theme['palette-text-color'] ?? theme['primary-text-color'],
      'palette-hover-color': theme['palette-hover-color'] ?? theme['primary-hover-color'],
      'palette-selected-color': theme['palette-selected-color'] ?? theme['primary-selected-color'],
      'palette-additional-color':
        theme['palette-additional-color'] ?? theme['primary-additional-color'],
    };
  }
}

export { ThemesManager };
