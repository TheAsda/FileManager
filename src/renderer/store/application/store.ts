import { createStore, createEvent } from 'effector';
import { clone } from 'lodash';
import { ApplicationStore } from './interfaces';
import { initialStore } from './initialStore';

const store = createStore<ApplicationStore>(initialStore);

const setWindowSize = createEvent<{ width: number; height: number }>();
store.on(setWindowSize, (state, value) => {
  state.window.height = value.height;
  state.window.width = value.width;

  return clone(state);
});

const setSectionsSize = createEvent<{
  explorer: { width: number };
  preview: { width: number };
  terminal: { width: number };
}>();
store.on(setSectionsSize, (state, value) => {
  state.window.sections.explorer = value.explorer;
  state.window.sections.preview = value.preview;
  state.window.sections.terminal = value.terminal;

  return clone(state);
});

export { store, setWindowSize, setSectionsSize };
