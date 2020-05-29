import { Settings } from '@fm/common';

interface ISettingsManager {
  /** Returns settings from manager */
  getSettings(): Settings;
}

export { ISettingsManager };
