import { KeyMap } from '@fm/common';

interface IKeysManager {
  /** Returns default and users key map settings */
  getKeyMap(): KeyMap;
}

export { IKeysManager };
