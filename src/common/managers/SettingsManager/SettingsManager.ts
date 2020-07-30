import { ISettingsManager } from './ISettingsManager';
import { inject, injectable } from 'inversify';
import { Settings, DEFAULT_SETTINGS } from '@fm/common';
import { TYPES } from '../../ioc';
import { ILogManager } from '../LogManager/ILogManager';
import { IDirectoryManager } from '../DirectoryManager/IDirectoryManager';
import { ConfigManager } from '../ConfigManager/ConfigManager';
import { merge } from 'lodash';

@injectable()
class SettingsManager extends ConfigManager implements ISettingsManager {
  private Settings?: Settings;

  constructor(
    @inject(TYPES.ILogManager) logger: ILogManager,
    @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager
  ) {
    super('settings', logger, directoryManager);
  }

  /** @inheritdoc */
  getSettings(): Settings {
    this._logger.log('Getting settings');
    if (!this.Settings) {
      this.Settings = this.retrieve();
    }

    return this.Settings;
  }

  private retrieve(): Settings {
    this._logger.log('Loading settings');
    const userSettings = this.getConfig<Settings>();

    return userSettings ? merge(DEFAULT_SETTINGS, userSettings) : DEFAULT_SETTINGS;
  }
}

export { SettingsManager };
