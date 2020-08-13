import { IKeyMapStore } from '../interfaces/IKeyMapStore';
import { KeyMapStore } from '../stores/KeyMapStore';
import { ipcMain } from 'electron';
import { Channels } from '../../common/Channels';

class KeyMapManager {
  keymapStore: IKeyMapStore;

  constructor() {
    this.keymapStore = new KeyMapStore();

    ipcMain.on(Channels.GET_KEYMAP, (event) => {
      event.reply(Channels.KEYMAP, this.keymapStore.getAll());
    });

    ipcMain.on(Channels.RESET_KEYMAP, (event) => {
      this.keymapStore.resetKeyMap();

      event.reply(Channels.KEYMAP, this.keymapStore.getAll());
    });
  }
}

export { KeyMapManager };
