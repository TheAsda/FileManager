import { Terminal } from 'xterm';
import { IIdentityManager } from '../IdentityManager';

interface ITerminalManager extends IIdentityManager {
  attach(terminal: Terminal, onExit?: (code: number) => void): void;

  changeDirectory(path: string): void;

  resize(size: { cols: number; rows: number }, terminal: Terminal): void;

  destroy(): void;

  getDirectory(): string;
}

export { ITerminalManager };
