import { createEvent, createStore } from 'effector';
import { warn } from 'electron-log';
import { includes } from 'lodash';

interface PathsStore {
  recent?: string;
  list: string[];
}

const pathsStore = createStore<PathsStore>({
  list: [],
});

const addPath = createEvent<string>();
pathsStore.on(addPath, (state, value) => {
  if (includes(state.list, value)) {
    return state;
  }

  return {
    ...state,
    list: [...state.list, value],
  };
});

const setRecent = createEvent<string>();
pathsStore.on(setRecent, (state, value) => {
  if (!includes(state.list, value)) {
    warn(`Element ${value} does not exist in state array`);
    return state;
  }

  return {
    ...state,
    recent: value,
  };
});

export { PathsStore, pathsStore, addPath, setRecent };
