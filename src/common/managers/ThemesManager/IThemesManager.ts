import { Theme } from '@fm/common';

interface IThemesManager {
  getTheme(themeName: string): Theme;
}

export { IThemesManager };
