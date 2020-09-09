import { ISettingsStore } from '../interfaces/ISettingsStore';
import { SettingsStore } from '../stores/SettingsStore';
import { Channels } from '../../common/Channels';
import { Settings } from '../../common/interfaces/Settings';
import { registerIpc } from '../ipc';
import { info } from 'electron-log';

let settingsStore: ISettingsStore;

const initSettingsIpc = () => {
  info('Initialize settings ipc');
  settingsStore = new SettingsStore();

  registerIpc(Channels.GET_SETTINGS, (event) => {
    event.returnValue = settingsStore.getAll();
  });

  registerIpc<Settings>(Channels.SAVE_SETTINGS, (event, settings) => {
    settingsStore.saveSettings(settings);
  });

  registerIpc(Channels.OPEN_SETTINGS, () => {
    settingsStore.openInEditor();
  });
};

export { initSettingsIpc };
