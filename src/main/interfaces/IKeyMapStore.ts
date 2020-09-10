import { KeyMap } from '@fm/common';

interface IUserKeymapStore {
  getAll(): KeyMap;

  resetKeyMap(): void;

  openInEditor(): void;
}

export { IUserKeymapStore };
