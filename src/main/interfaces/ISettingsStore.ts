import { Settings } from './Settings';

interface ISettingsStore {
  getAll(): Settings;

  getValue(key: string): unknown;

  setValue(key: string, value: unknown): void;

  resetSettings(): void;
}

export { ISettingsStore };
