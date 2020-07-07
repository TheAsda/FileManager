import { IExplorerManager } from './IExplorerManager';
import { injectable } from 'inversify';
import { execSync } from 'child_process';
import { forEach } from 'lodash';
import { IdentityManager } from '../IdentityManager';

@injectable()
class ExplorerManager extends IdentityManager implements IExplorerManager {
  private directory: string;
  private pathHandlers: ((path: string) => void)[];

  constructor() {
    super();
    this.directory = '';
    this.pathHandlers = [];
  }

  setPath(path: string): void {
    this.directory = path;
    this.onPathChange();
  }

  getPath(): string {
    return this.directory;
  }

  private onPathChange() {
    forEach(this.pathHandlers, (handler) => handler(this.getPath()));
  }

  openFile(fullPath: string): Promise<void> {
    try {
      execSync(fullPath);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject('Cannot open file');
    }
  }

  on(event: 'pathChange', handler: (path: string) => void): void {
    if (event === 'pathChange') {
      this.pathHandlers.push(handler);
    }
  }
}

export { ExplorerManager };
