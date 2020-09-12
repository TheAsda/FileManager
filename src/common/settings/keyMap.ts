import { KeyMap } from '@fm/common/interfaces/KeyMap';

const DEFAULT_KEYMAP: KeyMap = {
  moveUp: ['Up'],
  moveDown: ['Down'],
  moveBack: ['Backspace'],
  openDirectory: ['Enter'],
  switchPane: ['Tab'],
  activate: ['Enter'],
  openInNativeExplorer: ['CmdOrCtrl+O'],
  toggleShowHidden: ['CmdOrCtrl+H'],
  newFile: ['CmdOrCtrl+N'],
  newFolder: ['CmdOrCtrl+Shift+N'],
  rename: ['CmdOrCtrl+Shift+R', 'F2'],
  sendToTrash: ['Delete'],
  delete: ['Shift+Delete'],
  cut: ['CmdOrCtrl+X'],
  copy: ['CmdOrCtrl+C'],
  paste: ['CmdOrCtrl+V'],
  openCommandPalette: ['F1', 'CmdOrCtrl+Shift+P'],
  chooseItem: ['Shift+Up', 'Shift+Down'],
  openGoto: ['CmdOrCtrl+P'],
  scrollToTop: ['PageUp'],
  scrollToBottom: ['PageDown'],
  openIntegratedTerminal: ['CmdOrCtrl+`'],
  close: ['Esc'],
  complete: ['CmdOrCtrl+Space'],
  move: ['F5'],
  // CmdOrCtrl+Plus does not work, but hopefully electron guys will fix it someday
  zoomIn: ['CmdOrCtrl+Plus', 'CmdOrCtrl+='],
  zoomOut: ['CmdOrCtrl+-'],
  toggleFocusIndex: ['CmdOrCtrl+Tab'],
  toggleFocusPanel: ['CmdOrCtrl+Shift+Tab'],
};

const DISABLED_KEYS = ['Tab', 'Up+Down'];

export { DEFAULT_KEYMAP, DISABLED_KEYS };
