import { ITerminalManager } from './ITerminalManager';
import { IPty, spawn } from 'node-pty';
import { injectable } from 'inversify';
import { platform, homedir } from 'os';
import { exec } from 'child_process';
import { Terminal } from 'xterm';
import { IdentityManager } from '../IdentityManager';

@injectable()
class TerminalManager extends IdentityManager implements ITerminalManager {
  private process: IPty;

  constructor() {
    super();
    const shell = platform() === 'win32' ? 'powershell.exe' : 'bash';
    this.process = spawn(shell, [], {
      cwd: homedir(),
    });
  }

  attach(terminal: Terminal, onExit?: (code: number) => void): void {
    if (!this.process) {
      console.error('Terminal process has not been inicialized');
      return;
    }

    terminal.onData((data) => {
      this.process?.write(data);
    });

    this.process.onData((data: string | Uint8Array) => {
      terminal.write(data);
    });

    onExit && this.process.onExit((e) => onExit(e.exitCode));
  }

  changeDirectory(path: string): void {
    const cdCommand = `cd "${path}"\r`;
    this.process.write(cdCommand);
  }

  resize(size: { cols: number; rows: number }, terminal: Terminal): void {
    this.process.resize(
      Math.max(size ? size.cols : terminal.cols, 1),
      Math.max(size ? size.rows : terminal.rows, 1)
    );
  }

  destroy(): void {
    this.process.write(`exit \r`);
  }

  getDirectory(): string {
    // TODO: add getting cwd by pid

    return '/to/do/path';
  }
}

export { TerminalManager };
