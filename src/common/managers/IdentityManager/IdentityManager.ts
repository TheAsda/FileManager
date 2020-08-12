import { IIdentityManager } from './IIdentityManager';
import { Commands } from '@fm/common';

class IdentityManager implements IIdentityManager {
  private id: number;
  private commands: Commands;
  private hotkeys: Commands;

  constructor() {
    this.id = this.getRandomId();
    this.commands = {};
    this.hotkeys = {};
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  setCommands(commands: Commands): void {
    this.commands = commands;
  }

  setHotkeys(hotkeys: Commands): void {
    this.hotkeys = hotkeys;
  }

  getCommands(): Commands {
    return this.commands;
  }

  getHotkeys(): Commands {
    return this.hotkeys;
  }
}

export { IdentityManager };
