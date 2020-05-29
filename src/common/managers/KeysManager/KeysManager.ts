import { ConfigManager } from '../ConfigManager/ConfigManager';
import { injectable } from 'inversify';
import { KeyMap } from '@fm/common';
import { DEFAULT_KEYMAP } from '@fm/common';
import { merge } from 'lodash';

@injectable()
class KeysManager extends ConfigManager {
  /** Keymap for manager */
  private KeyMap?: KeyMap;

  constructor(fileName: string) {
    super(fileName);
  }

  /** Returns default and users key map settings */
  getKeyMap() {
    if (!this.KeyMap) {
      this.retrieve();
    }

    return this.KeyMap;
  }

  /** Loads key maps */
  private retrieve() {
    const fileInfo = this.getFile();

    if (fileInfo === null) {
      this.KeyMap = DEFAULT_KEYMAP;
    } else {
      this.KeyMap = merge(JSON.parse(fileInfo), DEFAULT_KEYMAP);
    }
  }
}

export { KeysManager };
