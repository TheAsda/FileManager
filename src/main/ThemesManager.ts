import { ipcMain } from 'electron';
import { Channels } from '../common/Channels';
import { forEach } from 'lodash';
import { IThemesStore } from './interfaces/IThemesStore';
import { ThemesStore } from './ThemesStore';

class ThemesManager {
  themesStore: IThemesStore;

  constructor() {
    this.themesStore = new ThemesStore();

    ipcMain.on(Channels.GET_THEME, (event) => {
      event.reply(Channels.THEME, this.themesStore.getTheme());
    });

    ipcMain.on(Channels.SET_THEME, (event, args: string[]) => {
      forEach(args, (item) => {
        this.themesStore.setThemeName(item);
      });

      event.reply(Channels.THEME, this.themesStore.getTheme());
    });

    ipcMain.on(Channels.RESET_THEME, (event) => {
      this.themesStore.resetTheme();

      event.reply(Channels.THEME, this.themesStore.getTheme());
    });

    ipcMain.on(Channels.OPEN_THEME, () => {
      this.themesStore.openInEditor();
    });
  }
}

export { ThemesManager };
