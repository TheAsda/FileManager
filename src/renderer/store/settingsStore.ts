import { Channels, DEFAULT_THEME, Theme } from '@fm/common';
import { createApi, createEffect, createStore, forward } from 'effector';
import { info } from 'electron-log';
import { sendIpc } from './ipc';

interface SettingsStore {
  autoPreview: boolean;
  showHidden: boolean;
  themeName: string;
  theme: Theme;
}

const settingsStore = createStore<SettingsStore>({
  autoPreview: true,
  showHidden: true,
  themeName: 'default',
  theme: DEFAULT_THEME,
});

const requestTheme = createEffect({
  handler: (name: string) => {
    return Promise.resolve(sendIpc<Theme>(Channels.GET_THEME, name));
  },
});

settingsStore.on(requestTheme.doneData, (state, value) => {
  return {
    ...state,
    theme: value,
  };
});

const settingsApi = createApi(settingsStore, {
  toggleAutoPreview: (state) => {
    info('Toggle auto preview');
    return {
      ...state,
      autoPreview: !state.autoPreview,
    };
  },
  toggleShowHidden: (state) => {
    info('Toggle show hidden');
    return { ...state, showHidden: !state.showHidden };
  },
  setTheme: (state, name: string) => {
    info(`Change theme to ${name}`);
    return {
      ...state,
      themeName: name,
    };
  },
});

forward({
  from: settingsApi.setTheme,
  to: requestTheme,
});

export { SettingsStore, settingsStore, settingsApi };
