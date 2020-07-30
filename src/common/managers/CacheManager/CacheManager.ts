import { isEqual, includes, debounce } from 'lodash';
import { ICacheManager } from './ICacheManager';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc';
import { ILogManager } from '../LogManager';
import { IDirectoryManager } from '../DirectoryManager';
import electron from 'electron';
import { join } from 'path';
const app = electron.app ?? electron.remote.app;

@injectable()
class CacheManager implements ICacheManager {
  private cacheList: string[];
  private initialCache: string[];
  private logger: ILogManager;
  private directoryManager: IDirectoryManager;

  constructor(
    @inject(TYPES.ILogManager) logger: ILogManager,
    @inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager
  ) {
    this.logger = logger;
    this.directoryManager = directoryManager;

    this.initialCache = this.getCache() ?? [];
    this.cacheList = [...this.initialCache];
  }

  async addToCache(path: string): Promise<void> {
    if (!includes(this.cacheList, path)) {
      this.logger.log(`Adding "${path}" to cache`);
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

  private get cachePath() {
    return join(app.getPath('userData'), 'cache.json');
  }

  async save(): Promise<void> {
    if (!isEqual(this.cache, this.initialCache)) {
      this.logger.log('Saving cache');

      this.directoryManager.writeFile(this.cachePath, JSON.stringify(this.cacheList));

      this.initialCache = this.cacheList;
    }
  }

  private getCache(): string[] {
    try {
      return JSON.parse(this.directoryManager.readFileSync(this.cachePath));
    } catch {
      this.logger.error('Cannot read cache file');
      return [];
    }
  }
}

export { CacheManager };
