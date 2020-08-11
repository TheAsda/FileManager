import { ipcMain } from 'electron';
import { ISettingsStore } from './interfaces/ISettingsStore';
import { ThemesManager } from './SettingsStore';
import { Channels } from '../common/Channels';
import { forEach } from 'lodash';

class SettingsManager {
  settingsStore: ISettingsStore;

  constructor() {
    this.settingsStore = new ThemesManager();

    ipcMain.on(Channels.GET_SETTINGS, (event) => {
      event.reply(Channels.SETTINGS, this.settingsStore.getAll());
    });

    ipcMain.on(
      Channels.SET_SETTINGS,
      (
        event,
        args: {
          key: string;
          value: unknown;
        }[]
      ) => {
        forEach(args, (item) => {
          this.settingsStore.setValue(item.key, item.value);
        });

        event.reply(Channels.SETTINGS, this.settingsStore.getAll());
      }
    );

    ipcMain.on(Channels.RESET_SETTINGS, (event) => {
      this.settingsStore.resetSettings();

      event.reply(Channels.SETTINGS, this.settingsStore.getAll());
    });

    ipcMain.on(Channels.OPEN_SETTINGS, () => {
      this.settingsStore.openInEditor();
    });
  }
}

export { SettingsManager };
