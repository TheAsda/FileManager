import { isEqual, includes, debounce } from 'lodash';
import { ConfigManager } from '../ConfigManager';
import { ICacheManager } from './ICacheManager';
import { injectable, inject } from 'inversify';
import { TYPES } from 'common/ioc';
import { ILogManager } from '../LogManager';
import { IDirectoryManager } from '../DirectoryManager';

const cacheFileName = 'cache.json';

@injectable()
class CacheManager extends ConfigManager implements ICacheManager {
  private cacheList: string[];
  private initialCache: string[];

  constructor(
    @inject(TYPES.ILogManager) logger: ILogManager,
    @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager
  ) {
    super(logger, directoryManager);

    this.initialCache = this.parseFile(cacheFileName) ?? [];
    this.cacheList = [...this.initialCache];
  }

  async addToCache(path: string): Promise<void> {
    if (!includes(this.cacheList, path)) {
      this._logger.log(`Adding "${path}" to cache`);
      this.cacheList.push(path);
      await this.debouncedSave();
    }
  }

  private debouncedSave = debounce(this.save, 1000, {
    leading: false,
    trailing: true,
  });

  get cache(): string[] {
    return this.cacheList;
  }

  async save(): Promise<void> {
    if (!isEqual(this.cache, this.initialCache)) {
      this._logger.log('Saving cache');
      await this.saveFile(cacheFileName, this.cacheList);
      this.initialCache = this.cacheList;
    }
  }
}

export { CacheManager };
