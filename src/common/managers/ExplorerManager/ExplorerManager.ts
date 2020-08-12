import { IExplorerManager } from './IExplorerManager';
import { forEach } from 'lodash';
import { IdentityManager } from '../IdentityManager';

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

  on(event: 'pathChange', handler: (path: string) => void): void {
    if (event === 'pathChange') {
      this.pathHandlers.push(handler);
    }
  }
}

export { ExplorerManager };
