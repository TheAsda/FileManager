import { Channels } from '@fm/common';
import { createEffect, createEvent, createStore } from 'effector';
import { warn } from 'electron-log';
import { includes } from 'lodash';
import { sendIpc } from './ipc';

interface PathsStore {
  recent?: string;
  list: string[];
}

const pathsStore = createStore<PathsStore>({
  list: [],
});

const fetchPaths = createEffect({
  handler: () => {
    return sendIpc<string[]>(Channels.GET_PATH);
  },
});

pathsStore.on(fetchPaths.doneData, (state, value) => {
  return {
    ...state,
    list: [...state.list, ...value],
  };
});

fetchPaths();

const addPath = createEvent<string>();
pathsStore.on(addPath, (state, value) => {
  if (includes(state.list, value)) {
    return state;
  }

  sendIpc(Channels.ADD_PATH, value);

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
