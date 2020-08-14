import { IKeyMapStore } from '../interfaces/IKeyMapStore';
import Store from 'electron-store';
import { KeyMap } from 'common/interfaces/KeyMap';
import { DEFAULT_KEYMAP } from '../../common/settings/keyMap';

class KeyMapStore implements IKeyMapStore {
  store: Store<KeyMap>;

  constructor() {
    this.store = new Store({
      name: 'keymap',
      defaults: DEFAULT_KEYMAP,
    });
  }

  getAll(): KeyMap {
    return this.store.store;
  }

  resetKeyMap(): void {
    this.store.reset();
  }

  openInEditor(): void {
    this.store.openInEditor();
  }
}

export { KeyMapStore };
