import { createApi } from 'effector';
import { store } from '../store';
import { clone } from 'lodash';
import { FileInfo } from '@fm/common';

const previewApi = createApi(store, {
  togglePreview: (state) => {
    state.preview.hidden = !state.preview.hidden;

    return clone(state);
  },
  setPreviewItem: (state, value: FileInfo) => {
    state.preview.item = value;

    return clone(state);
  },
});

export { previewApi };
