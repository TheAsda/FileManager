import { ConfigManager } from '../ConfigManager';
import { injectable, inject } from 'inversify';
import { KeyMap, DEFAULT_KEYMAP } from '@fm/common';
import { merge } from 'lodash';
import { IKeysManager } from './IKeysManager';
import { TYPES } from 'common/ioc';
import { IDirectoryManager } from '../DirectoryManager';
import { ILogManager } from '../LogManager';

@injectable()
class KeysManager extends ConfigManager implements IKeysManager {
  /** Keymap for manager */
  private KeyMap?: KeyMap;

  constructor(
    @inject(TYPES.ILogManager) logger: ILogManager,
    @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager
  ) {
    super(logger, directoryManager);
  }

  /** Returns default and users key map settings */
  getKeyMap(): KeyMap {
    this._logger.log('Getting key map');
    if (!this.KeyMap) {
      this.KeyMap = this.retrieve();
    }

    return this.KeyMap;
  }

  /** Loads key maps */
  private retrieve(): KeyMap {
    this._logger.log('Loading keymap');
    const userKeys = this.parseFile<KeyMap>('keymap.json');

    return userKeys ? merge(userKeys, DEFAULT_KEYMAP) : DEFAULT_KEYMAP;
  }
}

export { KeysManager };
