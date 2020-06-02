import { Terminal } from 'xterm';

interface ITerminalManager {
  attach(terminal: Terminal): void;

  changeDirectory(path: string): void;
}

export { ITerminalManager };
