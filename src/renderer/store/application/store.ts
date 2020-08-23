import { createStore, createEvent } from 'effector';
import { clone } from 'lodash';
import { ApplicationStore } from './interfaces';
import { initialStore } from './initialStore';
import { ipcRenderer } from 'electron';
import { Channels, ConfirmTypes, Layout, Settings } from '@fm/common';
import { mapLayout, mapSettings } from './storeMappers';
import { sendIpc } from '../ipc';

const layout = sendIpc<Layout, never>(Channels.GET_LAYOUT);
const settings = sendIpc<Settings, never>(Channels.GET_SETTINGS);

let s = mapLayout(initialStore, layout);
s = mapSettings(s, settings);

const store = createStore<ApplicationStore>(s);

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

ipcRenderer.on(Channels.BEFORE_QUIT, () => {
  ipcRenderer.send(Channels.SAVE_LAYOUT, mapLayout(store.getState()));
  ipcRenderer.send(Channels.QUITTER, ConfirmTypes.LAYOUT);
});

export { store, setWindowSize, setSectionsSize };
