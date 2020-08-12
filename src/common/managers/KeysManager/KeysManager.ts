import { KeyMap, DEFAULT_KEYMAP } from '@fm/common';
import { merge, isEmpty } from 'lodash';
import { IKeysManager } from './IKeysManager';
import Store from 'electron-store';

class KeysManager implements IKeysManager {
  private store: Store<KeyMap>;

  constructor() {
    this.store = new Store<KeyMap>({
      name: 'keymap',
    });
  }

  /** @inheritdoc */
  getKeyMap(): KeyMap {
    if (isEmpty(this.store.store)) {
      this.store.set(DEFAULT_KEYMAP);
      return DEFAULT_KEYMAP;
    }

    return merge(DEFAULT_KEYMAP, this.store.store);
  }
}

export { KeysManager };
