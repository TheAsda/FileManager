import { Channels } from '../../common/Channels';
import { globalShortcut } from 'electron';
import { flatten, forEach, map, uniq, values } from 'lodash';
import { sendIpc } from '../ipc';
import { keymapStore } from './initKeyMapIpc';

const mapMousetrapKeys = (values: string[]): string[] => {
  return map(values, (value) => {
    return value
      .replaceAll(/ctrl/, 'CmdOrCtrl')
      .replaceAll(/cmd/, 'CmdOrCtrl')
      .replaceAll(/alt/, 'Alt')
      .replaceAll(/shift/, 'Shift');
  });
};

const initKeyboardIpc = () => {
  const keymap = keymapStore.getAll();

  const allKeybindings = mapMousetrapKeys(uniq(flatten(values(keymap))));

  forEach(allKeybindings, (binding) => {
    globalShortcut.register(binding, () => {
      sendIpc(Channels.KEYPRESS, binding);
    });
  });
};

export { initKeyboardIpc };
