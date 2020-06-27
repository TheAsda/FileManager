import { IIdentityManager } from '../IdentityManager';

interface IExplorerManager extends IIdentityManager {
  setPath(path: string[]): void;

  enterDirectory(name: string): void;

  exitDirectory(): void;

  getPathString(): string;

  getPathArray(): string[];

  openFile(fullPath: string): Promise<void>;

  on(event: 'pathChange', handler: (path: string) => void): void;
}

export { IExplorerManager };
