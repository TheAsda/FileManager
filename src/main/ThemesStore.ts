import { IThemesStore } from './interfaces/IThemesStore';
import { Theme } from '@fm/common';
import Store from 'electron-store';

class ThemesStore implements IThemesStore {
  private store: Store<Theme>;
  private themeName: string;
  private defaultThemeName = 'default';

  constructor() {
    this.themeName = this.defaultThemeName;
    this.store = new Store<Theme>({
      name: 'themes/' + this.themeName,
    });
  }

  setThemeName(themeName: string): void {
    this.themeName = themeName;

    this.updateStore();
  }

  getTheme(): Theme {
    return this.store.store;
  }

  resetTheme(): void {
    this.themeName = this.defaultThemeName;

    this.updateStore();
  }

  openInEditor(): void {
    this.store.openInEditor();
  }

  private updateStore() {
    this.store = new Store<Theme>({
      name: 'themes/' + this.themeName,
    });
  }
}

export { ThemesStore };
