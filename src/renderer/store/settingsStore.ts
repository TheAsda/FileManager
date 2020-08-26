import { createApi, createStore } from 'effector';

interface SettingsStore {
  autoPreview: boolean;
  showHidden: boolean;
  theme: string;
}

const settingsStore = createStore<SettingsStore>({
  autoPreview: true,
  showHidden: true,
  theme: 'default',
});

const settingsApi = createApi(settingsStore, {
  toggleAutoPreview: (state) => {
    return {
      ...state,
      autoPreview: !state.autoPreview,
    };
  },
  toggleShowHidden: (state) => {
    return { ...state, showHidden: !state.showHidden };
  },
  setTheme: (state, theme: string) => {
    return {
      ...state,
      theme,
    };
  },
});

export { SettingsStore, settingsStore, settingsApi };
