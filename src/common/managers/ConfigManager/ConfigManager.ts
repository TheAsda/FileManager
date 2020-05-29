import { injectable } from 'inversify';
import electron from 'electron';
import { readFileSync } from 'original-fs';
import { join } from 'lodash';
const app = electron.app || electron.remote.app;

@injectable()
abstract class ConfigManager {
  /** Path to config file */
  protected fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  /**
   * Get config if exists
   */
  protected getFile(): string | null {
    const fullPath = join(app.getPath('userData'), this.fileName);
    try {
      const data = readFileSync(fullPath, { encoding: 'utf8' });
      return data;
    } catch {
      return null;
    }
  }
}

export { ConfigManager };
