interface IExplorerManager {
  setPath(path: string[]): void;

  enterDirectory(name: string): void;

  exitDirectory(): void;

  getPathString(): string;

  getPathArray(): string[];
}

export { IExplorerManager };
