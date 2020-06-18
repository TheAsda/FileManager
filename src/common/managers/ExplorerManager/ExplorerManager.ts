import { IDirectoryManager } from '../DirectoryManager';
import { IExplorerManager } from './IExplorerManager';
import { inject, injectable } from 'inversify';
import { TYPES } from 'common/ioc';
import { reduce } from 'lodash';

@injectable()
class ExplorerManager implements IExplorerManager {
  private directoryArray: string[];
  private DirectoryManager: IDirectoryManager;

  constructor(@inject(TYPES.IDirectoryManager) directoryManager: IDirectoryManager) {
    this.DirectoryManager = directoryManager;
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
}

export { ExplorerManager };
