import { ipcMain } from 'electron';
import { ISettingsStore } from '../interfaces/ISettingsStore';
import { SettingsStore } from '../stores/SettingsStore';
import { Channels } from '../../common/Channels';
import { Settings } from '@fm/common';

class SettingsManager {
  settingsStore: ISettingsStore;

  constructor() {
    this.settingsStore = new SettingsStore();

    ipcMain.on(Channels.GET_SETTINGS, (event) => {
      event.reply(Channels.SETTINGS, this.settingsStore.getAll());
    });

    ipcMain.on(Channels.SET_SETTINGS, (event, args: Settings) => {
      console.log('SettingsManager -> constructor -> args', args);
      this.settingsStore.saveSettings(args);

      event.reply(Channels.SETTINGS, this.settingsStore.getAll());
    });

    ipcMain.on(Channels.RESET_SETTINGS, (event) => {
      this.settingsStore.resetSettings();

      event.reply(Channels.SETTINGS, this.settingsStore.getAll());
    });

    ipcMain.on(Channels.OPEN_SETTINGS, () => {
      this.settingsStore.openInEditor();
    });

    ipcMain.on(Channels.SAVE_SETTINGS, (event, args: Settings) => {
      this.settingsStore.saveSettings(args);
    });
  }
}

export { SettingsManager };
