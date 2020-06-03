import { Terminal } from 'xterm';

interface ITerminalManager {
  attach(terminal: Terminal, onExit?: (code: number) => void): void;

  changeDirectory(path: string): void;
}

export { ITerminalManager };
