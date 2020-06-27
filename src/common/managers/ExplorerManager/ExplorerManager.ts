import { IExplorerManager } from './IExplorerManager';
import { injectable } from 'inversify';
import { execSync } from 'child_process';
import { reduce, forEach } from 'lodash';
import { IdentityManager } from '../IdentityManager';

@injectable()
class ExplorerManager extends IdentityManager implements IExplorerManager {
  private directoryArray: string[];
  private pathHandlers: ((path: string) => void)[];

  constructor() {
    super();
    this.directoryArray = [];
    this.pathHandlers = [];
  }

  setPath(path: string[]): void {
    this.directoryArray = path;
    this.onPathChange();
  }

  getPathString(): string {
    return reduce(this.directoryArray, (acc, cur) => acc + cur + '/', '');
  }

  getPathArray(): string[] {
    return this.directoryArray;
  }

  enterDirectory(name: string): void {
    this.directoryArray.push(name);
    this.onPathChange();
  }

  exitDirectory(): void {
    if (this.directoryArray.length > 1) {
      this.directoryArray.pop();
      this.onPathChange();
    }
  }

  private onPathChange() {
    forEach(this.pathHandlers, (handler) => handler(this.getPathString()));
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
