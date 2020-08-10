import { ipcMain } from 'electron';
import { ISettingsStore } from './interfaces/ISettingsStore';
import { SettingsStore } from './SettingsStore';
import { IpcMainEvent } from './mainEvent';
import { Window } from './Window';
import { forEach } from 'lodash';
import { IpcRendererEvent } from './rendererEvent';

class SettingsManager {
  settingsStore: ISettingsStore;

  constructor() {
    this.settingsStore = new SettingsStore();

    ipcMain.on(IpcMainEvent.GET_SETTINGS, (event) => {
      event.returnValue = this.settingsStore.getAll();
    });

    ipcMain.on(
      IpcMainEvent.SET_SETTINGS,
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

        event.reply(this.settingsStore.getAll());
      }
    );

    ipcMain.on(IpcMainEvent.RESET_SETTINGS, (event) => {
      this.settingsStore.resetSettings();

      event.reply(this.settingsStore.getAll());
    });
  }

  sendSettingsOnWindowLoad = (window: Window) => {
    window.once('show', () => {
      window.webContents.send(IpcRendererEvent.SETTINGS, this.settingsStore.getAll());
    });
  };
}

export { SettingsManager };
