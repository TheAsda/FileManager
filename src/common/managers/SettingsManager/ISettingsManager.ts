import { Settings } from '@fm/common';

interface ISettingsManager {
  /** Returns settings from manager */
  getSettings(): Settings;

  setSettings(key: keyof Settings | string, value: unknown): void;
}

export { ISettingsManager };
