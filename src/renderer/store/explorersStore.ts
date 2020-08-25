import { clearNode, createDomain, createEvent, Store } from 'effector';
import { warn, info } from 'electron-log';
import { normalize } from 'path';

interface ExplorerStore {
  height: number;
  path: string;
}

const domain = createDomain('explorers');
const explorersStore = domain.createStore<Store<ExplorerStore>[]>([]);

const spawnExplorer = createEvent<{ path?: string }>();
explorersStore.on(spawnExplorer, (state, value: { path?: string }) => {
  if (state.length > 1) {
    warn('Explorers store is full, cannot spawn new explorer');
    return state;
  }
  info('Spawn new explorer');

  return [
    ...state,
    domain.createStore<ExplorerStore>({
      height: 0,
      path: value.path ?? process.cwd(),
    }),
  ];
});

const destroyExplorer = createEvent<number>();
explorersStore.on(destroyExplorer, (state, value) => {
  const storeToDestroy = state.splice(value, 1);
  if (storeToDestroy.length === 0) {
    warn(`Cannot destroy explorer with index ${value}`);
    return state;
  }
  info(`Destroy explorer ${value}`);

  clearNode(storeToDestroy[0], { deep: true });

  return [...state];
});

const mountExplorerEvents = (store: Store<ExplorerStore>) => {
  const resizeExplorer = createEvent<number>();
  store.on(resizeExplorer, (state, value) => {
    return {
      ...state,
      height: value,
    };
  });

  const changePath = createEvent<string>();
  store.on(changePath, (state, value) => {
    return {
      ...state,
      path: normalize(value),
    };
  });

  return { resizeExplorer, changePath };
};

export { explorersStore, spawnExplorer, destroyExplorer, mountExplorerEvents, ExplorerStore };
