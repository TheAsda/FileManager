import { clearNode, createDomain, createEvent, Store, Event, createApi } from 'effector';
import { warn, info, error } from 'electron-log';
import { normalize } from 'path';

interface ExplorerStore {
  height: number;
  path: string;
}

const domain = createDomain('explorers');
const explorersStore = domain.createStore<Store<ExplorerStore>[]>([]);

interface EventStore {
  resizeExplorer: Event<number>;
  changePath: Event<string>;
}

const explorersEventsStore = domain.createStore<EventStore[]>([]);

const explorersEventsStoreApi = createApi(explorersEventsStore, {
  add: (state, value: EventStore) => {
    if (state.length > 1) {
      error('Too many events in the store');
      return state;
    }

    return [...state, value];
  },
  remove: (state, index: number) => {
    if (state.length === 0) {
      error('Cannot remove from empty events store');
      return state;
    }

    const itemToDelete = state.splice(index, 1)[0];

    if (!itemToDelete) {
      warn(`Cannot remove item with index ${index} from events store`);
      return state;
    }

    clearNode(itemToDelete.changePath);
    clearNode(itemToDelete.resizeExplorer);

    return [...state];
  },
});

const spawnExplorer = domain.createEvent<{ path?: string }>();
explorersStore.on(spawnExplorer, (state, value) => {
  if (state.length > 1) {
    warn('Explorers store is full, cannot spawn new explorer');
    return state;
  }
  info('Spawn new explorer');

  const store = domain.createStore<ExplorerStore>({
    height: 0,
    path: value.path ?? process.cwd(),
  });

  const events = mountExplorerEvents(store);

  explorersEventsStoreApi.add(events);

  return [...state, store];
});

const destroyExplorer = domain.createEvent<number>();
explorersStore.on(destroyExplorer, (state, value) => {
  const storeToDestroy = state.splice(value, 1)[0];
  if (!storeToDestroy) {
    warn(`Cannot find explorer with index ${value}`);
    return state;
  }
  info(`Destroy explorer ${value}`);

  explorersEventsStoreApi.remove(value);
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
  explorersEventsStore,
};
