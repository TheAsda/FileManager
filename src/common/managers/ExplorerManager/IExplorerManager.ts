import { IIdentityManager } from '../IdentityManager';

interface IExplorerManager extends IIdentityManager {
  setPath(path: string): void;

  getPath(): string;

  on(event: 'pathChange', handler: (path: string) => void): void;
}

export { IExplorerManager };
