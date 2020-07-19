import { Commands } from 'common/interfaces';

interface IIdentityManager {
  setId(id: number): void;

  getId(): number;

  setCommands(commands: Commands): void;

  setHotkeys(hotkeys: Commands): void;

  getCommands(): Commands;

  getHotkeys(): Commands;
}

export { IIdentityManager };
