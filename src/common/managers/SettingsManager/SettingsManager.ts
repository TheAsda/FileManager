import { ISettingsManager } from './ISettingsManager';
import { injectable } from 'inversify';
import { Settings, DEFAULT_SETTINGS } from '@fm/common';
import { merge, isEmpty } from 'lodash';
import Store from 'electron-store';

@injectable()
class SettingsManager implements ISettingsManager {
  private store: Store<Settings>;

  constructor() {
    this.store = new Store<Settings>({
      name: 'settings',
    });
  }

  /** @inheritdoc */
  getSettings(): Settings {
    if (isEmpty(this.store.store)) {
      this.store.set(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }

    return merge(DEFAULT_SETTINGS, this.store.store);
  }

  setSettings(key: keyof Settings | string, value: unknown): void {
    this.store.set(key, value);
  }
}

export { SettingsManager };
