import { Channels } from '../../common/Channels';
import { flatten, forEach, uniq, values } from 'lodash';
import { sendIpc } from '../ipc';
import { keymapStore } from './initKeyMapIpc';
import { register } from 'electron-localshortcut';
import { getWindow } from '../window';
import { error, debug } from 'electron-log';

const initKeyboardIpc = () => {
  const keymap = keymapStore.getAll();

  const allKeybindings = uniq(flatten(values(keymap)));
  forEach(allKeybindings, (binding) => {
    try {
      register(binding, () => {
        if (getWindow()) {
          debug(`Send ${binding} to renderer process`);
          sendIpc(Channels.KEYPRESS, binding);
        }
      });
    } catch (e) {
      error(e, binding);
    }
  });
};

export { initKeyboardIpc };
