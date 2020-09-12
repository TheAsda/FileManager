import { KeyMap } from '@fm/common/interfaces/KeyMap';

const DEFAULT_KEYMAP: KeyMap = {
  moveUp: ['Up'],
  moveDown: ['Down'],
  moveBack: ['Backspace'],
  openDirectory: ['Enter'],
  switchPane: ['Tab'],
  activate: ['Enter'],
  openInNativeExplorer: ['Ctrl+O'],
  toggleShowHidden: ['Ctrl+H'],
  newFile: ['Ctrl+N'],
  newFolder: ['Ctrl+Shift+N'],
  rename: ['Ctrl+Shift+R', 'F2'],
  sendToTrash: ['Delete'],
  delete: ['Shift+Delete'],
  cut: ['Ctrl+X'],
  copy: ['Ctrl+C'],
  paste: ['Ctrl+V'],
  openCommandPalette: ['F1', 'Ctrl+Shift+P'],
  chooseItem: ['Shift+Up', 'Shift+Down'],
  openGoto: ['Ctrl+P'],
  scrollToTop: ['PageUp'],
  scrollToBottom: ['PageDown'],
  openIntegratedTerminal: ['Ctrl+`'],
  close: ['Esc'],
  complete: ['Ctrl+Space'],
  move: ['F5'],
  zoomIn: ['Ctrl+Plus'],
  zoomOut: ['Ctrl+-'],
  toggleFocusIndex: ['Ctrl+Tab'],
  toggleFocusPanel: ['Ctrl+Shift+Tab'],
};

const DISABLED_KEYS = ['Tab', 'Up+Down'];

export { DEFAULT_KEYMAP, DISABLED_KEYS };
