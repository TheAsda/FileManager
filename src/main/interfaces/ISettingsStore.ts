import { Settings } from '@fm/common';

interface ISettingsStore {
  getAll(): Settings;

  getValue(key: string): unknown;

  setValue(key: string, value: unknown): void;

  resetSettings(): void;

  openInEditor(): void;

  saveSettings(settings: Settings): void;
}

export { ISettingsStore };
