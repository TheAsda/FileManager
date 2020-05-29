import { ILogManager } from './ILogManager';
import { injectable } from 'inversify';
import Logger, { createLogger, LoggerOptions } from 'bunyan';

const loggerOptions: LoggerOptions = {
  name: 'Logger',
};

@injectable()
class LogManager implements ILogManager {
  private Logger: Logger;

  constructor(
    logLevel: number | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  ) {
    this.Logger = createLogger({ ...loggerOptions, level: logLevel });
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
