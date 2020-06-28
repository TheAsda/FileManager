import { KeyMap } from '@fm/common';

const DEFAULT_KEYMAP: KeyMap = {
  moveUp: ['up'],
  moveDown: ['down'],
  moveBack: ['backspace'],
  openDirectory: ['enter'],
  switchPane: ['tab'],
  activate: ['enter'],
  openInNativeExplorer: ['ctrl+o'],
  toggleShowHidden: ['ctrl+h'],
  newFile: ['ctrl+n'],
  newFolder: ['ctrl+shift+n'],
  rename: ['ctrl+shift+r', 'f2'],
  sendToTrash: ['del'],
  delete: ['shift+del'],
  cut: ['ctrl+x'],
  copy: ['ctrl+c'],
  paste: ['ctrl+v'],
  openCommandPalette: ['f1', 'ctrl+shift+p'],
  chooseItem: ['shift+up', 'shift+down'],
  openGoto: ['ctrl+p'],
  scrollToTop: ['pageup'],
  scrollToBottom: ['pagedown'],
  openIntegratedTerminal: ['ctrl+`'],
};

export { DEFAULT_KEYMAP };
