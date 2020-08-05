import { injectable, inject } from 'inversify';
import { Theme, DEFAULT_THEME } from '@fm/common';
import { IThemesManager } from './IThemesManager';
import { ILogManager } from '../LogManager/ILogManager';
import { merge, isEmpty, isEqual, clone } from 'lodash';
import { TYPES } from '../../ioc';
import Store from 'electron-store';

@injectable()
class ThemesManager implements IThemesManager {
  private logger: ILogManager;

  constructor(@inject(TYPES.ILogManager) logger: ILogManager) {
    this.logger = logger;
  }

  /** @inheritdoc */
  getTheme(themeName: string): Theme {
    this.logger.log('Getting theme');

    const store = new Store<Theme>({
      name: 'themes/' + themeName,
    });

    let theme = store.store;

    // TODO: fill all the fields and get rid of fillTheme method(only merge default and custom)
    if (themeName === 'default') {
      if (!isEqual(this.fillTheme(DEFAULT_THEME), theme)) {
        store.set(this.fillTheme(DEFAULT_THEME));
      }
      theme = DEFAULT_THEME;
    } else if (isEmpty(theme)) {
      store.set(this.fillTheme(DEFAULT_THEME));
      theme = DEFAULT_THEME;
    } else {
      theme = merge(clone(DEFAULT_THEME), theme);
    }

    return this.fillTheme(theme);
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
      'terminal-background-color':
        theme['terminal-background-color'] ?? theme['primary-background-color'],
      'terminal-black-color': theme['terminal-black-color'] ?? '',
      'terminal-blue-color': theme['terminal-blue-color'] ?? '',
      'terminal-brightBlack-color': theme['terminal-brightBlack-color'] ?? '',
      'terminal-brightBlue-color': theme['terminal-brightBlue-color'] ?? '',
      'terminal-brightCyan-color': theme['terminal-brightCyan-color'] ?? '',
      'terminal-brightGreen-color': theme['terminal-brightGreen-color'] ?? '',
      'terminal-brightMagenta-color': theme['terminal-brightMagenta-color'] ?? '',
      'terminal-brightRed-color': theme['terminal-brightRed-color'] ?? '',
      'terminal-brightWhite-color': theme['terminal-brightWhite-color'] ?? '',
      'terminal-brightYellow-color': theme['terminal-brightYellow-color'] ?? '',
      'terminal-cursor-color': theme['terminal-cursor-color'] ?? '',
      'terminal-cursorAccent-color': theme['terminal-cursorAccent-color'] ?? '',
      'terminal-cyan-color': theme['terminal-cyan-color'] ?? '',
      'terminal-foreground-color': theme['terminal-foreground-color'] ?? '',
      'terminal-green-color': theme['terminal-green-color'] ?? '',
      'terminal-magenta-color': theme['terminal-magenta-color'] ?? '',
      'terminal-red-color': theme['terminal-red-color'] ?? '',
      'terminal-selection-color': theme['terminal-selection-color'] ?? '',
      'terminal-white-color': theme['terminal-white-color'] ?? '',
      'terminal-yellow-color': theme['terminal-yellow-color'] ?? '',
      'terminal-font-family': theme['terminal-font-family'] ?? '',
      'terminal-font-size': theme['terminal-font-size'] ?? 15,
    };
  }
}

export { ThemesManager };
