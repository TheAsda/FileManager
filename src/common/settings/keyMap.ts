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
  close: ['esc'],
  complete: ['ctrl+space'],
  move: ['f5'],
  zoomIn: ['ctrl+plus'],
  zoomOut: ['ctrl+-'],
  toggleFocusIndex: ['ctrl+tab'],
  toggleFocusPanel: ['ctrl+shift+tab'],
};

const DISABLED_KEYS = ['tab'];

export { DEFAULT_KEYMAP, DISABLED_KEYS };
