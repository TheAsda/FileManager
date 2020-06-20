interface IExplorerManager {
  setPath(path: string[]): void;

  enterDirectory(name: string): void;

  exitDirectory(): void;

  getPathString(): string;

  getPathArray(): string[];

  openFile(fullPath: string): Promise<void>;
}

export { IExplorerManager };
