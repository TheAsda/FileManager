import { Channels } from '../../common/Channels';
import { IKeyMapStore } from '../interfaces/IKeyMapStore';
import { KeyMapStore } from '../stores/KeyMapStore';
import { registerIpc } from '../ipc';
import { info } from 'electron-log';

let keyMapStore: IKeyMapStore;

const initKeyMapIpc = () => {
  info('Initialize keymap ipc');
  keyMapStore = new KeyMapStore();

  registerIpc(Channels.GET_KEYMAP, (event) => {
    event.returnValue = keyMapStore.getAll();
  });

  registerIpc(Channels.RESET_KEYMAP, () => {
    keyMapStore.resetKeyMap();
  });
};

export { initKeyMapIpc };
