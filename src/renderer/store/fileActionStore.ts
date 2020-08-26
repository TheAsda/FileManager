import { createStore, createApi } from 'effector';
import { FileInfo } from '@fm/common';
import { warn } from 'electron-log';

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
    if (value.files.length === 0) {
      warn('Empty array of files to make an action on');
      return state;
    }

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

export { FileActionType, FileActionStore, FileActionInfo, fileActionStore, fileActionApi };
