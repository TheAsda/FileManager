import { KeyMap } from '@fm/common';

interface IKeyMapStore {
  getAll(): KeyMap;

  resetKeyMap(): void;

  openInEditor(): void;
}

export { IKeyMapStore };
