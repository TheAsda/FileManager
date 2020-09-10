import { Channels } from '../../common/Channels';
import { IUserKeymapStore } from '../interfaces/IKeyMapStore';
import { UserKeymapStore } from '../stores/KeymapStore';
import { registerIpc } from '../ipc';
import { info } from 'electron-log';

let keymapStore: IUserKeymapStore;

const initKeyMapIpc = () => {
  info('Initialize keymap ipc');
  keymapStore = new UserKeymapStore();

  registerIpc(Channels.GET_KEYMAP, (event) => {
    event.returnValue = keymapStore.getAll();
  });

  registerIpc(Channels.RESET_KEYMAP, () => {
    keymapStore.resetKeyMap();
  });
};

export { keymapStore, initKeyMapIpc };
