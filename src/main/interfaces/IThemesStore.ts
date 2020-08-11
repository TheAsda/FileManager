import { Theme } from '@fm/common';

interface IThemesStore {
  setThemeName(themeName: string): void;

  getTheme(): Theme;

  resetTheme(): void;

  openInEditor(): void;
}

export { IThemesStore };
