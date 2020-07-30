import { ILogManager } from './ILogManager';
import { injectable, inject } from 'inversify';
import Logger, { createLogger, LoggerOptions } from 'bunyan';
import { TYPES } from '../../ioc';
import { ISettingsManager } from '../SettingsManager';

const loggerOptions: LoggerOptions = {
  name: 'Logger',
};

@injectable()
class LogManager implements ILogManager {
  private Logger: Logger;

  constructor(@inject(TYPES.ISettingsManager) settingsManager: ISettingsManager) {
    this.Logger = createLogger({ ...loggerOptions, level: settingsManager.getSettings().logLevel });
  }

  /** @inheritdoc */
  log(message: string): void {
    this.Logger.info(message);
  }

  /** @inheritdoc */
  debug(message: string): void {
    this.Logger.debug(message);
  }

  /** @inheritdoc */
  error(message: string): void {
    this.Logger.error(message);
  }

  /** @inheritdoc */
  critical(message: string): void {
    this.Logger.fatal(message);
  }
}

export { LogManager };
