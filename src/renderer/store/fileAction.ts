import { createStore, createApi } from 'effector';
import { FileInfo } from '@fm/common';

type FileActionType = 'move' | 'copy';

interface FileActionInfo {
  type: FileActionType;
  files: FileInfo[];
  destinationPath: string;
}

interface FileActionStore {
  info?: FileActionInfo;
  display: boolean;
}

const fileActionStore = createStore<FileActionStore>({
  display: false,
});

const fileActionApi = createApi(fileActionStore, {
  activate: (state, value: FileActionInfo) => {
    return {
      info: value,
      display: true,
    };
  },
  deactivate: () => {
    return {
      info: undefined,
      display: false,
    };
  },
});

export { FileActionType, FileActionStore, fileActionStore, fileActionApi };
