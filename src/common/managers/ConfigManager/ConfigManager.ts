import { injectable } from 'inversify';
import electron from 'electron';
import { join } from 'path';
import { ILogManager } from '../LogManager/ILogManager';
import { IDirectoryManager } from '../DirectoryManager/IDirectoryManager';
const app = electron.app || electron.remote?.app;

@injectable()
abstract class ConfigManager {
  /** Path to config file */
  protected _directotyManager: IDirectoryManager;
  protected _logger: ILogManager;
  constructor(logger: ILogManager, directoryManager: IDirectoryManager) {
    this._directotyManager = directoryManager;
    this._logger = logger;
  }

  /**
   * Get config if exists
   */
  protected parseFile<T>(fileName: string): T | null {
    const fullPath = join(app.getPath('userData'), fileName);

    try {
      const userData = this._directotyManager.readFileSync(fullPath);
      this._logger.log(`Retrieving config from ${fullPath}`);

      return JSON.parse(userData);
    } catch {
      this._logger.error(`Cannot parse config from ${fullPath}`);

      return null;
    }
  }

  /**
   * Write config file
   *
   * @param fileName the name of the config file
   */
  protected async saveFile<T>(fileName: string, config: T): Promise<void> {
    const fullPath = join(app.getPath('userData'), fileName);

    try {
      await this._directotyManager.writeFile(fullPath, JSON.stringify(config));
      this._logger.log(`File saved to ${fullPath}`);

      return Promise.resolve();
    } catch {
      const errorMessage = `Cannot write ${fullPath}`;

      this._logger.error(errorMessage);
      return Promise.reject();
    }
  }
}

export { ConfigManager };
