import { injectable, unmanaged } from 'inversify';
import electron from 'electron';
import { join } from 'path';
import { ILogManager } from '../LogManager/ILogManager';
import { IDirectoryManager } from '../DirectoryManager/IDirectoryManager';
import Store from 'electron-store';
const app = electron.app || electron.remote?.app;

@injectable()
abstract class ConfigManager {
  /** Path to config file */
  protected _directotyManager: IDirectoryManager;
  protected _logger: ILogManager;
  private store: Store;

  constructor(
    @unmanaged() configName: string,
    logger: ILogManager,
    directoryManager: IDirectoryManager
  ) {
    this._directotyManager = directoryManager;
    this._logger = logger;
    this.store = new Store({
      name: configName,
    });
  }

  /**
   * Get config if exists
   */
  protected getConfig<T>(): T | null {
    return this.store.store as T;
  }

  /**
   * Write config file
   *
   * @param fileName the name of the config file
   */
  protected async saveFile<T>(config: T): Promise<void> {
    this.store.set(config);
  }
}

export { ConfigManager };
