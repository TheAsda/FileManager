import { injectable, inject } from 'inversify';
import { KeyMap, DEFAULT_KEYMAP } from '@fm/common';
import { TYPES } from '../../ioc';
import { merge, isEmpty } from 'lodash';
import { IKeysManager } from './IKeysManager';
import { ILogManager } from '../LogManager';
import Store from 'electron-store';

@injectable()
class KeysManager implements IKeysManager {
  private logger: ILogManager;
  private store: Store<KeyMap>;

  constructor(@inject(TYPES.ILogManager) logger: ILogManager) {
    this.logger = logger;
    this.store = new Store<KeyMap>({
      name: 'keymap',
    });
  }

  /** @inheritdoc */
  getKeyMap(): KeyMap {
    this.logger.log('Getting key map');

    if (isEmpty(this.store.store)) {
      this.store.set(DEFAULT_KEYMAP);
      return DEFAULT_KEYMAP;
    }

    return merge(DEFAULT_KEYMAP, this.store.store);
  }
}

export { KeysManager };
