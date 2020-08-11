import { IPathStore } from './interfaces/IPathStore';
import Store from 'electron-store';

class PathStore implements IPathStore {
  store: Store<string[]>;

  constructor() {
    this.store = new Store({
      name: 'paths',
    });
  }

  getPaths(): string[] {
    return this.store.store;
  }

  addToPath(path: string): void {
    this.store.set([path]);
  }
}

export { PathStore };
