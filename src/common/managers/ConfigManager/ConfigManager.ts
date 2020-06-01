import { injectable } from 'inversify';
import electron from 'electron';
import { join } from 'path';
import { ILogManager } from '../LogManager/ILogManager';
import { IDirectoryManager } from '../DirectoryManager/IDirectoryManager';
const app = electron.app || electron.remote.app;

@injectable()
abstract class ConfigManager {
  /** Path to config file */
  protected DirectotyManager: IDirectoryManager;
  protected Logger: ILogManager;

  constructor(logger: ILogManager, directoryManager: IDirectoryManager) {
    this.DirectotyManager = directoryManager;
    this.Logger = logger;
  }

  /**
   * Get config if exists
   */
  protected parseFile<T>(fileName: string): T | null {
    const fullPath = join(app.getPath('userData'), fileName);

    try {
      const userData = this.DirectotyManager.readFileSync(fullPath);
      this.Logger.log(`Retrieving config from ${fullPath}`);

      return JSON.parse(userData);
    } catch {
      this.Logger.error(`Cannot parse config from ${fullPath}`);

      return null;
    }
  }
}

export { ConfigManager };
