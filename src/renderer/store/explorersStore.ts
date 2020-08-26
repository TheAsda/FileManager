import { clearNode, createDomain, createEvent, Store } from 'effector';
import { warn, info } from 'electron-log';
import { normalize } from 'path';

interface ExplorerStore {
  height: number;
  path: string;
}

const domain = createDomain('explorers');
const explorersStore = domain.createStore<Store<ExplorerStore>[]>([]);

const spawnExplorer = domain.createEvent<{ path?: string }>();
explorersStore.on(spawnExplorer, (state, value) => {
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

const destroyExplorer = domain.createEvent<number>();
explorersStore.on(destroyExplorer, (state, value) => {
  const storeToDestroy = state.splice(value, 1)[0];
  if (!storeToDestroy) {
    warn(`Cannot find explorer with index ${value}`);
    return state;
  }
  info(`Destroy explorer ${value}`);

  clearNode(storeToDestroy, { deep: true });

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

interface ExplorersStateStore {
  width: number;
  hidden: boolean;
}

const explorersStateStore = domain.createStore<ExplorersStateStore>({
  hidden: false,
  width: 0,
});

const resizeExplorers = domain.createEvent<number>();
explorersStateStore.on(resizeExplorers, (state, value) => {
  return {
    ...state,
    width: value,
  };
});

const toggleExplorers = domain.createEvent();
explorersStateStore.on(toggleExplorers, (state) => {
  return {
    ...state,
    hidden: !state.hidden,
  };
});

export {
  destroyExplorer,
  explorersStateStore,
  ExplorersStateStore,
  explorersStore,
  ExplorerStore,
  mountExplorerEvents,
  resizeExplorers,
  spawnExplorer,
  toggleExplorers,
};
