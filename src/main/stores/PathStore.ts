import { IPathStore } from '../interfaces/IPathStore';
import Store from 'electron-store';
import { debug } from 'electron-log';

class PathStore implements IPathStore {
  store: Store<{ list: string[] }>;

  constructor() {
    this.store = new Store<{ list: string[] }>({
      name: 'paths',
      defaults: {
        list: [],
      },
    });
  }

  getPaths(): string[] {
    return this.store.store.list;
  }

  addToPath(path: string): void {
    debug(`Adding path ${path}`);
    this.store.set({
      list: [...this.store.store.list, path],
    });
  }
}

export { PathStore };
