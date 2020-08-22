import { ISettingsStore } from '../interfaces/ISettingsStore';
import Store, { Schema } from 'electron-store';
import { Settings } from '@fm/common';

const settingsSchema: Schema<Settings> = {
  autoPreview: {
    type: 'boolean',
    default: false,
  },
  theme: {
    type: 'string',
    default: 'default',
  },
  showHidden: {
    type: 'boolean',
    default: false,
  },
};

class SettingsStore implements ISettingsStore {
  store: Store<Settings>;

  constructor() {
    this.store = new Store<Settings>({
      name: 'settings',
      schema: settingsSchema,
    });
  }

  saveSettings(settings: Settings): void {
    this.store.set(settings);
  }

  openInEditor(): void {
    this.store.openInEditor();
  }

  getAll(): Settings {
    return this.store.store;
  }

  getValue(key: string): unknown {
    return this.store.get(key);
  }

  setValue(key: string, value: unknown): void {
    this.store.set(key, value);
  }

  resetSettings(): void {
    this.store.reset();
  }
}

export { SettingsStore };
