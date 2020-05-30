import { ISettingsManager } from './ISettingsManager';
import { inject, injectable } from 'inversify';
import { Settings } from '@fm/common';
import { TYPES } from 'common/ioc';
import { ILogManager, IDirectoryManager } from '@fm/common';
import { ConfigManager } from '@fm/common';
import { merge } from 'lodash';
import { DEFAULT_KEYMAP, DEFAULT_SETTINGS } from 'common/settings';

@injectable()
class SettingsManager extends ConfigManager implements ISettingsManager {
  private Settings?: Settings;

  constructor(
    @inject(TYPES.ILogManager) logger: ILogManager,
    @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager
  ) {
    super(logger, directoryManager);
  }

  /** @inheritdoc */
  getSettings(): Settings {
    if (!this.Settings) {
      this.Settings = this.retrieve();
    }

    return this.Settings;
  }

  private retrieve(): Settings {
    const userSettings = this.parseFile<Settings>('settings.json');

    return userSettings
      ? merge(DEFAULT_SETTINGS, userSettings)
      : DEFAULT_SETTINGS;
  }
}

export { SettingsManager };
