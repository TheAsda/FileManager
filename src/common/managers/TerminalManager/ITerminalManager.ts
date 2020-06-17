import { Terminal } from 'xterm';

interface ITerminalManager {
  attach(terminal: Terminal, onExit?: (code: number) => void): void;

  changeDirectory(path: string): void;

  resize(size: { cols: number; rows: number }, terminal: Terminal): void;

  destroy(): void;
}

export { ITerminalManager };
