import { createEvent, createStore } from 'effector';
import { FileInfo } from '@fm/common';

interface PreviewStore {
  width: number;
  file?: FileInfo;
  hidden: boolean;
}

const previewStore = createStore<PreviewStore>({
  hidden: false,
  width: 0,
});

const resizePreview = createEvent<number>();
previewStore.on(resizePreview, (state, value) => {
  return {
    ...state,
    width: value,
  };
});

const togglePreview = createEvent();
previewStore.on(togglePreview, (state) => {
  return {
    ...state,
    hidden: !state.hidden,
  };
});

const setPreviewFile = createEvent<FileInfo>();
previewStore.on(setPreviewFile, (state, value) => {
  return {
    ...state,
    file: value,
  };
});

export { PreviewStore, previewStore, resizePreview, togglePreview, setPreviewFile };
