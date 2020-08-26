import { ITerminalManager, TerminalManager } from '@fm/common';
import { clearNode, createDomain, createEvent, Store } from 'effector';
import { info, warn } from 'electron-log';

interface TerminalStore {
  height: number;
  manager: ITerminalManager;
}

const domain = createDomain('terminals');
const terminalsStore = domain.createStore<Store<TerminalStore>[]>([]);

const spawnTerminal = domain.createEvent<{ path?: string }>();
terminalsStore.on(spawnTerminal, (state, value) => {
  if (state.length > 1) {
    warn('Terminals store is full, cannot spawn new explorer');
    return state;
  }
  info('Spawn new terminal');

  return [
    ...state,
    domain.createStore<TerminalStore>({
      height: 0,
      manager: new TerminalManager(value.path),
    }),
  ];
});

const destroyTerminal = domain.createEvent<number>();
terminalsStore.on(destroyTerminal, (state, value) => {
  const storeToDestroy = state.splice(value, 1)[0];
  if (!storeToDestroy) {
    warn(`Cannot find terminal with index ${value}`);
    return state;
  }
  info(`Destroy terminal ${value}`);

  storeToDestroy.getState().manager.destroy();

  clearNode(storeToDestroy, { deep: true });

  return [...state];
});

const mountTerminalEvents = (store: Store<TerminalStore>) => {
  const resizeTerminal = createEvent<number>();
  store.on(resizeTerminal, (state, value) => {
    return {
      ...state,
      height: value,
    };
  });

  const changePath = createEvent<string>();
  store.on(changePath, (state, value) => {
    state.manager.changeDirectory(value);
    return {
      ...state,
    };
  });

  return { resizeTerminal, changePath };
};

interface TerminalsStateStore {
  width: number;
  hidden: boolean;
}

const terminalsStateStore = domain.createStore<TerminalsStateStore>({
  hidden: false,
  width: 0,
});

const resizeTerminals = domain.createEvent<number>();
terminalsStateStore.on(resizeTerminals, (state, value) => {
  return {
    ...state,
    width: value,
  };
});

const toggleTerminals = domain.createEvent();
terminalsStateStore.on(toggleTerminals, (state) => {
  return {
    ...state,
    hidden: !state.hidden,
  };
});

export {
  destroyTerminal,
  mountTerminalEvents,
  resizeTerminals,
  spawnTerminal,
  terminalsStateStore,
  TerminalsStateStore,
  terminalsStore,
  TerminalStore,
  toggleTerminals,
};
