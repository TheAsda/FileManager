import { IExplorerManager } from './IExplorerManager';
import { injectable } from 'inversify';
import { execSync } from 'child_process';
import { reduce } from 'lodash';
import { IdentityManager } from '../IdentityManager';

@injectable()
class ExplorerManager extends IdentityManager implements IExplorerManager {
  private directoryArray: string[];

  constructor() {
    super();
    this.directoryArray = [];
  }

  setPath(path: string[]): void {
    this.directoryArray = path;
  }

  getPathString(): string {
    return reduce(this.directoryArray, (acc, cur) => acc + cur + '/', '');
  }

  getPathArray(): string[] {
    return this.directoryArray;
  }

  enterDirectory(name: string): void {
    this.directoryArray.push(name);
  }

  exitDirectory(): void {
    if (this.directoryArray.length > 1) {
      this.directoryArray.pop();
    }
  }

  openFile(fullPath: string): Promise<void> {
    try {
      execSync(fullPath);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject('Cannot open file');
    }
  }
}

export { ExplorerManager };
