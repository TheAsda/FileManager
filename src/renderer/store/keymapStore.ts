import { DEFAULT_KEYMAP, KeyMap } from '@fm/common';
import { createStore } from 'effector';

const keymapStore = createStore<KeyMap>(DEFAULT_KEYMAP);

export { keymapStore };
