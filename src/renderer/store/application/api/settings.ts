import { createApi } from 'effector';
import { store } from '../store';
import { clone } from 'lodash';

const settingsApi = createApi(store, {
  toggleAutoPreview: (state) => {
    state.settings.autoPreview = !state.settings.autoPreview;

    return clone(state);
  },
  toggleShowHidden: (state) => {
    state.settings.showHidden = !state.settings.showHidden;

    return clone(state);
  },
});

export { settingsApi };
