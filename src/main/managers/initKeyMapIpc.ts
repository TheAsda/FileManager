import { Channels } from '../../common/Channels';
import { IKeyMapStore } from '../interfaces/IKeyMapStore';
import { KeyMapStore } from '../stores/KeyMapStore';
import { registerIpc } from '../ipc';

let keyMapStore: IKeyMapStore;

const initKeyMapIpc = () => {
  keyMapStore = new KeyMapStore();

  registerIpc(Channels.GET_KEYMAP, (event) => {
    event.returnValue = keyMapStore.getAll();
  });

  registerIpc(Channels.RESET_KEYMAP, () => {
    keyMapStore.resetKeyMap();
  });
};

export { initKeyMapIpc };
